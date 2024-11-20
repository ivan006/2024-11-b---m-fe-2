import { Model } from '@vuex-orm/core'
import {
    Attribute,
    BelongsTo,
    BelongsToMany,
    HasMany,
    MorphMany,
    MorphToMany,
    Boolean,
    MorphTo,
    Number,
    Relation,
    String,
    Uid,
    HasOne,
} from '@vuex-orm/core'
import Helpers from '../utils/Helpers'



export default class DBCrudCacheSet extends Model {
    static entity = 'DBCrudCacheSet'

    static fields() {
        return {
            id: this.uid(null),
            fields: this.attr([]),
        }
    }

    static Generate(model) {
        let fields = model.fields()
        let lookupKeys = [] // To keep track of foreign keys

        let result = []

        let newField = {}

        for (const fieldName in fields) {
            let field = fields[fieldName]
            // if (!excludedCols.includes(fieldName)) {
            const label = Helpers.snakeToTitle(fieldName)

            let usageType = 'normal'
            let important = false
            let fieldExtras = {}
            if (
                model.fieldsMetadata &&
                model.fieldsMetadata[fieldName]
            ) {
                if (model.fieldsMetadata[fieldName].usageType){
                    usageType = model.fieldsMetadata[fieldName].usageType
                }
                if (model.fieldsMetadata[fieldName].important){
                    important = model.fieldsMetadata[fieldName].important
                }
                fieldExtras = model.fieldsMetadata[fieldName]
            }

            let dataType = 'attr'
            if (field instanceof Uid) dataType = 'uid'
            else if (field instanceof String) dataType = 'string'
            else if (field instanceof Boolean) dataType = 'boolean'
            else if (field instanceof Number) dataType = 'number'
            else if (field instanceof Attribute) dataType = 'attr'

            if (
                field instanceof HasMany ||
                field instanceof BelongsToMany ||
                field instanceof HasOne ||
                field instanceof MorphMany ||
                field instanceof MorphToMany
            ) {
                newField = {
                    name: fieldName,
                    field: fieldName,
                    label,
                    usageType:
                        'relChildren' +
                        Helpers.capitalizeFirstLetter(usageType),
                    dataType: dataType,
                    important,
                    fieldExtras,
                    meta: {
                        relation: field.constructor.name,
                        field: field,
                    },
                }

                result.push(newField)
            } else if (
                field instanceof Relation &&
                (field instanceof BelongsTo || field instanceof MorphTo)
            ) {
                const relatedModelFields = field.parent.fields()
                // const lookupDisplayField = Object.keys(relatedModelFields).find(
                //     (fName) =>
                //         fName !== 'id' &&
                //         relatedModelFields[fName] instanceof Attribute
                // )
                const lookupDisplayField = field.parent.titleKey


                let rules = []
                let required = false

                // if (!fields[field.foreignKey].isNullable) {
                //     rules = [(v) => !!v || `${label} is required.`]
                //     required = true
                // }

                newField = {
                    name: fieldName,
                    field: fieldName,
                    label,
                    usageType:
                        'relLookup' + Helpers.capitalizeFirstLetter(usageType),
                    dataType: dataType,
                    important,
                    fieldExtras,
                    meta: {
                        rules,
                        required,
                        foreignKey: field.foreignKey,
                        foreignKeyField: fields[field.foreignKey],
                        relation: field.constructor.name,
                        relatedModel: field.parent,
                        field: field,
                        lookupDisplayField: lookupDisplayField,
                        lookupField: fieldName,
                    },
                }

                // if (!excludedCols.includes(field.foreignKey)) {
                result.push({
                    ...newField,
                    meta: {
                        ...newField.meta
                    }
                })
                lookupKeys.push({
                    ...newField,
                    meta: {
                        ...newField.meta
                    }
                })
                // }
                // } else if (usageType == 'creatorType') {
                //     let rules = []
                //     if (!field.isNullable) {
                //         rules = [(v) => !!v || `${label} is required.`]
                //     }
                //
                //     newField = {
                //         name: fieldName,
                //         label,
                //         usageType: usageType,
                //         dataType: dataType,
                //         meta: {
                //             rules,
                //         },
                //     }
                //
                //     result.push(newField)
            } else {

                let rules = []
                let required = false

                if (!field.isNullable) {
                    rules = [(v) => !!v || `${label} is required.`]
                    required = true
                }

                newField = {
                    name: fieldName,
                    field: fieldName,
                    label,
                    usageType: usageType,
                    dataType: dataType,
                    important,
                    fieldExtras,
                    meta: {
                        rules,
                        required,
                    },
                }

                result.push(newField)
            }
            // }
        }

        // result = result.filter(
        //     (field) => field !== null && !lookupKeys.includes(field.name)
        // )

        for (const lookupKey of lookupKeys) {
            const foreignKeyKey = result.findIndex(
                (item) => lookupKey.meta.foreignKey == item.name
            )

            const originalForeignKeyValue = result[foreignKeyKey]

            if (result[foreignKeyKey].usageType.startsWith('mapExtraRel')) {
                const lookupKeyKey = result.findIndex(
                    (item) => lookupKey.name == item.name
                )
                result[lookupKeyKey].usageType =
                    'relLookup' +
                    Helpers.capitalizeFirstLetter(
                        result[foreignKeyKey].usageType
                    )
            }

            let dataType = 'attr'
            const foreignKeyValue = {
                ...lookupKey,
                usageType:
                    'relForeignKey' +
                    Helpers.capitalizeFirstLetter(
                        originalForeignKeyValue.usageType
                    ),
                dataType: dataType,
                meta: {
                    ...lookupKey.meta,
                    ...originalForeignKeyValue.meta
                },
                important: originalForeignKeyValue.important,
                fieldExtras: originalForeignKeyValue.fieldExtras,
                name: lookupKey.meta.foreignKey,
                field: lookupKey.meta.foreignKey,
            }

            result[foreignKeyKey] = foreignKeyValue
        }
        const payload = {
            data: { id: model.entity, fields: result },
        }
        this.insert(payload)
    }
}
