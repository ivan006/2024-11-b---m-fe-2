// import Helpers from '../utils/Helpers.js'
import DBCrudCacheSet from './DBCrudCacheSet'
// import html2pdf from "html2pdf.js";
// import html2canvas from 'html2canvas';


class QuickListsHelpers {
    static quickListsIsMobile() {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            return true
        } else {
            return false
        }
    }

    static mapPlaceFields() {
        return [
            // {
            //     flag: 'location_address_place_name',
            //     googleType: 'simple',
            //     googleName: 'location_address_place_name',
            // },
            {
                flag: 'mapExtraFormattedAddress',
                googleType: 'simple',
                googleName: 'formatted_address',
            },
            {
                flag: 'mapExtraPlaceID',
                googleType: 'simple',
                googleName: 'place_id',
            },
            {
                flag: 'mapExtraGeoLocLong',
                googleType: 'mapGeoLoc',
                googleName: 'lng',
            },
            {
                flag: 'mapExtraGeoLocLat',
                googleType: 'mapGeoLoc',
                googleName: 'lat',
            },
            {
                flag: 'relForeignKeyMapExtraRelCountry',
                googleType: 'components',
                googleName: 'country',
            },
            {
                flag: 'relForeignKeyMapExtraRelAdminArea1',
                googleType: 'components',
                googleName: 'administrative_area_level_1',
            },
            {
                flag: 'relForeignKeyMapExtraRelAdminArea2',
                googleType: 'components',
                googleName: 'administrative_area_level_2',
            },
            {
                flag: 'relForeignKeyMapExtraRelLocality',
                googleType: 'components',
                googleName: 'locality',
            },
            // {
            //     flag: 'mapExtraRelSublocality1',
            //     googleType: 'components',
            //     googleName: 'sublocality_level_1',
            // },
            // {
            //     flag: 'mapExtraRelSublocality2',
            //     googleType: 'components',
            //     googleName: 'sublocality_level_2',
            // },
            {
                flag: 'relForeignKeyMapExtraRelSublocality',
                googleType: 'components',
                googleName: ['sublocality_level_1', 'sublocality_level_2'], // Search for both sublocality levels
            },
        ]
    }

    static quickListsGetIfMatchesAllChecks(item, filters) {
        for (const [key, filter] of Object.entries(filters)) {
            // todo: note the below logic was to support time range filters
            if (
                typeof filter === 'object' &&
                !Array.isArray(filter) &&
                filter !== null
            ) {
                if (filter?.value) {
                    if (filter.usageType === 'timeRangeStart') {
                        if (filter.value.range.start) {
                            const startDate = new Date(filter.value.range.start)
                            const endDate = new Date(filter.value.range.end)
                            const itemDate = new Date(item[key])
                            return startDate < itemDate && itemDate < endDate
                        }
                    }
                }
            } else if (filter !== null) {
                return item[key] == filter
            }
        }

        return true
    }

    static computedAttrs(model, excludedCols = []) {
        let crudCache = DBCrudCacheSet.find(model.entity)
        if (!crudCache) {
            DBCrudCacheSet.Generate(model)
            crudCache = DBCrudCacheSet.find(model.entity)
        }
        const result = this.computedAttrs2(crudCache.fields, excludedCols)
        return result
    }


    static async downloadPdf(title, bodyElement, margin = 0, footerElement = null, headerElement = null) {
        // // Configuration for PDF generation
        // const opt = {
        //     margin: margin,
        //     image: { type: 'jpeg', quality: 0.98 },
        //     html2canvas: { scale: 1 },
        //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        // };
        //
        // const wrapperDiv = document.createElement('div');
        //
        // // Create and append title div
        // const titleDiv = document.createElement('div');
        // titleDiv.className = 'text-h6 text-grey-7 text-center q-mb-lg';
        // titleDiv.textContent = title;
        // wrapperDiv.appendChild(titleDiv);
        //
        // // Clone and append the body element
        // wrapperDiv.appendChild(bodyElement.cloneNode(true));
        //
        // // Generate PDF from the main content
        // const pdf = await html2pdf().from(wrapperDiv).set(opt).toPdf().get('pdf');
        //
        // const pageCount = pdf.internal.getNumberOfPages();
        //
        // // Helper function to add an image to the PDF
        // const addImageToPdf = async (element, pdf, x, y, width) => {
        //     const canvas = await html2canvas(element, { scale: 2 });
        //     const imgData = canvas.toDataURL('image/png');
        //     pdf.addImage(imgData, 'PNG', x, y, width);
        // };
        //
        // // Loop to add headers and footers
        // let addPromises = [];
        //
        // for (let i = 1; i <= pageCount; i++) {
        //     pdf.setPage(i);
        //
        //     // Add Header
        //     if (headerElement) {
        //         const addHeaderPromise = addImageToPdf(headerElement, pdf, 0, 0, 793 / 96); // Width is in inches
        //         addPromises.push(addHeaderPromise);
        //     }
        //
        //     // Add Footer
        //     if (footerElement) {
        //         const addFooterPromise = addImageToPdf(
        //             footerElement,
        //             pdf,
        //             0,
        //             pdf.internal.pageSize.getHeight() - (margin[2] ? +margin[2] + 0.5 / 96 : 0), // Bottom position
        //             793 / 96
        //         );
        //         addPromises.push(addFooterPromise);
        //     }
        // }
        //
        // // Wait for all headers and footers to be added
        // await Promise.all(addPromises);
        //
        // // Save the final PDF
        // pdf.save(`${title}.pdf`);
    }


    static computedAttrs2(fields, excludedCols = []) {
        let lookupKeys = [] // To keep track of foreign keys

        let result = []

        for (const field of fields) {

            if (field.usageType.startsWith('relLookupNormal')) {
                if (!excludedCols.includes(field.meta.foreignKey)){
                    result.push({
                        ...field,
                        meta: {
                            important: field.important,
                            ...field.meta,
                            hideField: false,
                        }
                    })
                    lookupKeys.push(field)
                } else {
                    result.push({
                        ...field,
                        meta: {
                            important: field.important,
                            ...field.meta,
                            hideField: true,
                        }
                    })
                }
            } else {
                if(!excludedCols.includes(field.name)) {
                    result.push({
                        ...field,
                        meta: {
                            important: field.important,
                            ...field.meta,
                            hideField: false,
                        }
                    })
                } else {
                    result.push({
                        ...field,
                        meta: {
                            important: field.important,
                            ...field.meta,
                            hideField: true,
                        }
                    })
                }
            }

            // excludedCols
            // if (field.usageType.startsWith('relForeignKey')) {
            //     result.push(field)
            //     lookupKeys.push(field)
            // } else {
            //     result.push(field)
            // }
        }
        return result
    }


    static SupaerTableHeaders(model, excludedCols = [], canEdit = true, displayMapField = false) {
        let result = [];
        const computedAttrs = this.computedAttrs(model, excludedCols);

        for (const computedAttr of computedAttrs) {
            if (computedAttr.usageType.startsWith('relForeignKey')) {
                // do nothing
            } else if (computedAttr.usageType.startsWith('relLookup')) {
                const relatedAttrs = this.computedAttrs(computedAttr.meta.field.parent, excludedCols);
                // console.log("computedAttr")
                // console.log(computedAttr)
                // console.log(relatedAttrs)
                let headerParentFields = [];
                for (const relatedAttr of relatedAttrs) {
                    // if (relatedAttr.important === true) {
                        if (relatedAttr.usageType.startsWith('relForeignKey')) {
                            // do nothing
                        } else {
                            headerParentFields.push({
                                usageType: relatedAttr.usageType,
                                dataType: relatedAttr.dataType,
                                meta: relatedAttr.meta,
                                name: `${computedAttr.name}.${relatedAttr.name}`,
                                align: 'left',
                                label: relatedAttr.label,
                                field: row => row[computedAttr.name] && row[computedAttr.name][relatedAttr.name],
                                format: val => `${val}`,
                                sortable: true,
                            });
                        }
                    // }
                }

                result.push({
                    usageType: computedAttr.usageType,
                    dataType: computedAttr.dataType,
                    meta: computedAttr.meta,
                    headerParentFields: headerParentFields,
                    name: computedAttr.name,
                    align: 'left',
                    label: computedAttr.label,
                    field: computedAttr.name,
                    sortable: true,
                    children: headerParentFields,
                });
            } else {
                result.push({
                    usageType: computedAttr.usageType,
                    dataType: computedAttr.dataType,
                    meta: computedAttr.meta,
                    name: computedAttr.name,
                    align: 'left',
                    label: computedAttr.label,
                    field: computedAttr.name,
                    sortable: true,
                });
            }
        }

        if (canEdit) {
            result.push({
                usageType: 'actions',
                dataType: 'actions',
                name: 'actions',
                align: 'right',
                label: 'Actions',
                field: 'actions',
                sortable: false,
            });
        }

        result = result.filter(item => {
            if (displayMapField) {
                if (!item.usageType.startsWith('relForeignKey')) {
                    return true;
                }
            } else {
                return (
                    !item.usageType.startsWith('relForeignKey') &&
                    !item.usageType.startsWith('relLookupMapExtra') &&
                    !item.usageType.startsWith('mapExtra')
                );
            }
        });

        return result;
    }


    static preparePayload(input, modelFields) {
        let result = []
        for (const attr of modelFields) {
            if (typeof input?.[attr.name] !== 'undefined') {
                if (attr.usageType.startsWith('relForeignKey')) {
                    result[attr.meta.foreignKey] = input[attr.meta.foreignKey]
                } else if (attr.usageType.startsWith('relLookup')) {
                    // do nothing
                } else if (attr.usageType.startsWith('relChildren')) {
                    // do nothing
                } else if (
                    [
                        'timestampType',
                        'readOnlyTimestampType',
                        'timeRangeStart',
                        'timeRangeEnd',
                    ].includes(attr.usageType)
                ) {
                    if (input[attr.name]) {
                        result[attr.name] = input[attr.name]
                    }
                } else {
                    result[attr.name] = input[attr.name]
                }
            }
        }
        delete result.$id
        return result
    }
}

export default QuickListsHelpers
