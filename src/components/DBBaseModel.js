import { Model } from '@vuex-orm/core'
import Helpers from './Helpers'
// import { serialize } from 'object-to-formdata';

export default class DBBaseModel extends Model {

    static adapator = 'supabase'
    static primaryKey = 'id';

    static openRecord(pKeyValue, item, router){}

    static rules = {
        readables: () => true,
        readable: (item) => true,
        editable: (item) => true,
        creatable: () => true,
    };

    static NormalizeRecursive(value) {
        const result = this.NormalizeRecursiveChild(
            value,
            null,
            'attributes',
            'data'
        )
        return result
    }

    static NormalizeRecursiveChild(
        value,
        parent,
        propertyGroupNameToFlatten,
        elementGroupNameToFlatten
    ) {
        let result = value
        if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null
        ) {
            //Chatgpts logic start
            // New logic: Rename keys ending in '_id'
            // Object.keys(value).forEach((key) => {
            //     if (key.endsWith('_id') && typeof value[key] == "object" && value[key] !== null) {
            //         const newKey = key.slice(0, -3) // Removing "_id"
            //         value[newKey] = value[key]
            //         delete value[key]
            //     }
            // })

            //Chatgpts logic end

            if (value[elementGroupNameToFlatten] !== undefined) {
                const valueToFlatten = value[elementGroupNameToFlatten]
                result = this.NormalizeRecursiveChild(
                    valueToFlatten,
                    value,
                    propertyGroupNameToFlatten,
                    elementGroupNameToFlatten
                )
            } else {
                let flattened = value
                if (value[propertyGroupNameToFlatten] !== undefined) {
                    const valueToFlatten = value[propertyGroupNameToFlatten]
                    flattened = { ...value, ...valueToFlatten }
                }
                result = {}
                Object.keys(flattened).map((key) => {
                    if (key !== propertyGroupNameToFlatten) {
                        result[key] = this.NormalizeRecursiveChild(
                            flattened[key],
                            value,
                            propertyGroupNameToFlatten,
                            elementGroupNameToFlatten
                        )
                    }
                })
            }
        } else if (Array.isArray(value)) {
            result = []
            value.map((value2, key) => {
                result[key] = this.NormalizeRecursiveChild(
                    value2,
                    value,
                    propertyGroupNameToFlatten,
                    elementGroupNameToFlatten
                )
            })
        }
        return result
    }

    static customApiBase(moreHeaders) {
        // const baseUrlAndHeaders =
        //   CustonMixins.methods.DefaultHeadersAndBaseUrl()
        this.apiConfig = {
            // ...DefaultSISHeadersAndBaseUrl(),
            // baseURL: baseUrlAndHeaders.baseURL,
            baseURL: "",
            headers: {
                // ...baseUrlAndHeaders.headers,
                ...moreHeaders,
            },
        }
        return this.api()
    }

    static titleKey = this.primaryKey;

    static customSupabaseApiFetchAll(
        url,
        relationships = [],
        flags = {},
        headers = {},
        options = {
            page: 1,
            limit: 15,
            filters: {},
            clearPrimaryModelOnly: false
        },
        modelClass
    ) {
        let offset = (options.page - 1) * options.limit
        // todo: note - i hade to put the filters in line because urls can have duplicates keys and objects cans and i needed duplicates key support for the date range filter

        let computedUrl = url
        let preparedRels = {}
        let filtersObj = {}

        if (modelClass.adapator === "supabase"){

            computedUrl= `${url}?${Helpers.prepareFiltersForSupabase(options.filters)}`
            preparedRels = Helpers.prepareRelationsForSupabase(relationships)

        } else if(modelClass.adapator === "laravel") {

            // computedUrl= `${url}?${Helpers.prepareFiltersForLaravel(options.filters)}`
            filtersObj = Helpers.prepareFiltersForLaravel(options.filters); // Now returns an object
            preparedRels = Helpers.prepareRelationsForLaravel(relationships)

        }

        return this.customApiBase(headers)
            .get(computedUrl, {
                persistBy: 'insertOrUpdate',
                params: {
                    ...{
                        limit: options.limit,
                        offset: offset,
                    },
                    ...flags,
                    ...preparedRels,
                    ...filtersObj
                },
                dataTransformer: ({ data }) => {
                    if (options.clearPrimaryModelOnly) {
                        this.deleteAll()
                    }
                    const result = this.NormalizeRecursive(data)
                    return result
                },
            })
        // .then((res) => {
        //   return res
        // })
        // .catch((error) => {
        //   // CustonMixins.methods.logNetworkError(error)
        //   // return error // < would this be needed maybe?
        // })
    }

    static customSupabaseApiFetchById(url, id, relationships = [], flags = {}, headers = {} , modelClass) {
        relationships

        let computedUrl = url
        let preparedRels = {}
        if (modelClass.adapator === "supabase"){
            computedUrl= `${url}?id=eq.${id}`
            preparedRels = Helpers.prepareRelationsForSupabase(relationships)
        } else if(modelClass.adapator === "laravel") {
            computedUrl = `${url}/${id}`
            preparedRels = Helpers.prepareRelationsForLaravel(relationships)
        }

        return this.customApiBase(headers)
            .get(computedUrl, {
                params: {
                    ...preparedRels,
                },
                dataTransformer: ({ data }) => {
                    const result = this.NormalizeRecursive(data)
                    return result
                },
            })
        // .then((res) => {
        //   return res
        // })
        // .catch((error) => {
        //   // CustonMixins.methods.logNetworkError(error)
        // })
    }

    static customSupabaseApiStore(url, entity, relationships = [], flags = {}, headers = {} , modelClass, supportFiles = false) {
        let computedUrl = url
        // if (modelClass.adapator === "supabase"){
        //   computedUrl = `${url}?id=eq.${entity.id}`
        // } else if(modelClass.adapator === "laravel") {
        //   computedUrl = `${url}/${entity.id}`
        // }
        if (supportFiles) {
            // entity = serialize(entity);
        }

        return this.customApiBase(headers)
            .post(
                computedUrl,
                { ...entity },
                {
                    params: {
                        ...flags,
                    },
                    dataTransformer: ({ data }) => {
                        const result =
                            this.NormalizeRecursive(data)
                        return result
                    },
                }
            )
        // .then((res) => {
        //   // CustonMixins.methods.logNetworkSuccess(res)
        //   return res
        // })
        // .catch((error) => {
        //   // CustonMixins.methods.logNetworkError(error)
        // })
    }

    static customSupabaseApiUpsert(url, entity, relationships = [], flags = {}, headers = {} , modelClass) {

        return this.customApiBase(headers)
            .post(
                url,
                { ...entity },
                {
                    params: {
                        ...flags,
                    },
                    dataTransformer: ({ data }) => {
                        const result =
                            this.NormalizeRecursive(data)
                        return result
                    },
                }
            )
        // .then((res) => {
        //   // CustonMixins.methods.logNetworkSuccess(res)
        //   return res
        // })
        // .catch((error) => {
        //   // CustonMixins.methods.logNetworkError(error)
        // })
    }


    static customSupabaseApiUpdate(url, entity, relationships = [], flags = {}, headers = {}, modelClass, supportFiles = false) {
        let computedUrl = url
        if (modelClass.adapator === "supabase"){
            computedUrl = `${url}?id=eq.${entity.id}`
        } else if(modelClass.adapator === "laravel") {
            computedUrl = `${url}/${entity.id}`
        }

        // const queryParams = new URLSearchParams(flags).toString();
        // if (queryParams) {
        //     computedUrl += (computedUrl.includes('?') ? '&' : '?') + queryParams;
        // }

        // if (supportFiles) {
        //   entity = serialize(entity);
        // }

        return this.customApiBase(headers)
            .patch(
                computedUrl,
                { ...entity },
                // entity,
                {
                    params: {
                        ...flags,
                    },
                    dataTransformer: ({ data }) => {
                        const result =
                            this.NormalizeRecursive(data)
                        return result
                    },
                    save: true,
                }
            );
    }

    static customSupabaseApiDelete(url, entityId, flags = {}, headers = {} , modelClass) {

        let computedUrl = url
        if (modelClass.adapator === "supabase"){
            computedUrl = `${url}?id=eq.${entityId}`
        } else if(modelClass.adapator === "laravel") {
            computedUrl = `${url}/${entityId}`
        }

        return this.customApiBase(headers)
            .delete(computedUrl, {
                delete: entityId,
            })
        // .then((res) => {
        //   // CustonMixins.methods.logNetworkSuccess(res)
        //   return res
        // })
        // .catch((error) => {
        //   // CustonMixins.methods.logNetworkError(error)
        // })
    }
}
