<template>
    <SuperTable
        :showMap="true"
        :model="superTableModel"
        @clickRow="openRecord"
        :displayMapField="false"
        :parentKeyValuePair="parentKeyValuePair"
        :fetchFlags="fetchFlags"
        :noBorder="noBorder"
        :templateListGrid="templateListGrid"
        :viewAs="{
          show: ['table', 'grid'],
          default: 'grid'
        }"
    />
</template>

<script>
import { SuperTable } from 'wizweb-fe'
import User from 'src/models/User'

export default {
    name: 'User-list',
    components: {
        SuperTable,
    },

    props: {
        noBorder: {
          type: Boolean,
          default: () => {
            return false
          }
        },
        parentKeyValuePair: {
            type: Object,
            default: () => ({})
        },
        fetchFlags: {
            type: Object,
            default: () => ({})
        }
    },
    data(){
      return {


        templateListGrid: {
          colWidth: 12,
          class: "q-pa-md q-col-gutter-sm",
          cols: [

            {
              width: 2,
              dataPoint: {
                field: "id",
              },
            },
            {
              width: 2,
              dataPoint: {
                field: "company_name",
              },
            },
            {
              width: 2,
              dataPoint: {
                field: "email",
              },
            },
            {
              width: 2,
              dataPoint: {
                field: "first_name",
              },
            },
            {
              width: 2,
              dataPoint: {
                field: "last_name",
              },
            },
            {
              width: 2,
              dataPoint: {
                field: "mobile_number",
              },
            },
            {
              width: 2,
              dataPoint: {
                field: "profile_photo",
              },
            },
            {
              width: 2,
              dataPoint: {
                hideLabel: true,
                field: "actions",
              },
            },
            {
              width: 2,
              dataPoint: {
                type: "component",
                // componentPath: () => import('./EventImage.vue'),
                componentPath: () => import('./UserButtonEmail.vue'),
                label: "",
                class: "text-right ",
                hideLabel: true,
              },
            },

          ]
        },
      }
    },
    computed: {
        superTableModel() {
            return User
        },
    },
    methods: {
        openRecord(pVal, item, router) {
            router.push({
                name: '/lists/users/:rId/:rName',
                params: {
                    rId: pVal,
                    rName: pVal,
                },
            })
        },
    },
}
</script>
