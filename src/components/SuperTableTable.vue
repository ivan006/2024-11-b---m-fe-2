<template>
  <div>
    <div v-if="items.length">
      <table class="table-auto w-full">
        <thead>
        <tr>
          <th v-for="header in flattenedHeadersHideMapField" :key="header.field" class="px-4 py-2 text-left">
            {{ header.label }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(row, index) in items"
            :key="index"
            :class="tableRowClassFn({ row })"
            @click="clickRow(row)"
            :style="{ cursor: model.rules.readable(row) ? 'pointer' : 'unset' }"
        >
          <td
              v-for="header in flattenedHeaders"
              :key="header.field"
              class="px-4 py-2"
          >
            <div v-if="header.isChildOf">
              <DatapointForDisplay
                  :item="row[header.isChildOf.value]"
                  :superOptions="superOptions"
                  :childRelations="[]"
                  :dataPoint="header.userConfig"
                  :header="header"
                  hideLabel
                  @editItem="editItem"
                  @deleteItem="deleteItem"
                  protectImage
              />
            </div>
            <div v-else>
              <DatapointForDisplay
                  :item="row"
                  :superOptions="superOptions"
                  :childRelations="[]"
                  :dataPoint="header.userConfig"
                  :header="header"
                  hideLabel
                  @editItem="editItem"
                  @deleteItem="deleteItem"
                  protectImage
              />
            </div>
          </td>
        </tr>
        </tbody>
      </table>


    </div>

    <template v-else>
      <div v-if="loading" class="text-center py-4">Loading...</div>
      <div v-else-if="loadingError" class="text-center py-4 text-red-500">Loading Error</div>
      <div v-else class="text-center py-4 text-gray-500">None</div>
    </template>
  </div>
</template>

<script>
import DatapointForDisplayInner from "./DatapointForDisplayInner.vue";
import DatapointForDisplay from "./DatapointForDisplay.vue";
import QuickListsHelpers from "./QuickListsHelpers";

export default {
  name: "SuperTableTable",
  components: {DatapointForDisplay, DatapointForDisplayInner},
  props: {
    hidePagination: {
      type: Boolean,
      default() {
        return false;
      },
    },
    templateListTable: {
      type: Object,
      default() {
        return {};
      },
    },
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    itemsLength: {
      type: Number,
      default() {
        return null;
      },
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
    loadingError: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // superOptions: {
    //   type: Object,
    //   default() {
    //     return {
    //       headers: [],
    //       modelFields: [],
    //       displayMapField: false,
    //       model: {},
    //       canEdit: false,
    //       currentParentRecord: {},
    //       user: {},
    //     };
    //   },
    // },
    excludedCols: {
      type: Array,
      default() {
        return [];
      },
    },
    model: {
      type: [Object, Function],
      required: true,
    },
    displayMapField: {
      type: Boolean,
      required: false,
    },
    canEdit: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      sortBy: [],
      // loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: [],
        descending: false,
      },
    };
  },
  computed: {
    superOptions() {
      return {
        headers: this.headers,
        modelFields: this.modelFields,
        displayMapField: this.displayMapField,
        model: this.model,
        canEdit: this.canEdit,
      };
    },
    headers() {
      const result = QuickListsHelpers.SupaerTableHeaders(
          this.model,
          this.excludedCols,
          this.canEdit,
          this.displayMapField,
      );
      return result;
    },
    modelFields() {
      const result = QuickListsHelpers.computedAttrs(
          this.model,
          this.excludedCols,
      );
      return result;
    },
    pKey() {
      return this.superOptions.model.primaryKey;
    },
    optionsComputed: {
      get() {
        return this.options;
      },
      set(value) {
        this.$emit("update:options", value);
      },
    },
    flattenedHeaders() {
      let result = [];
      if (this.templateListTable.length) {
        for (const field of this.templateListTable) {
          const validField = this.superOptions.headers.find(
              (header) => header.field === field.field,
          );
          let addableField = {};

          if (typeof validField !== "undefined") {
            addableField = validField;

            if (typeof field.label !== "undefined") {
              addableField.label = field.label;
            }
            addableField.userConfig = field;
          } else {
            let label = "";
            if (typeof field.label !== "undefined" && !field.hideLabel) {
              label = field.label;
            }

            let fieldName = "";
            if (typeof field.field !== "undefined") {
              fieldName = field.field;
            }

            addableField = {
              align: "left",
              dataType: "attr",
              field: fieldName,
              label: label,
              meta: {},
              name: fieldName,
              sortable: fieldName.length ? true : false,
              usageType: "normal",
              userConfig: field,
            };
          }

          result.push(addableField);
        }

        // let actionField = this.superOptions.headers.find((field) => {
        //   return field.usageType == "actions";
        // });
        // if (actionField){
        //   result.push({
        //     ...actionField
        //   });
        // }
      } else {
        for (const header of this.superOptions.headers) {
          if (header.usageType !== "relChildrenNormal") {
            result.push(header);
            if (header.headerParentFields) {
              for (const childHeader of header.headerParentFields) {
                if (childHeader.meta.important) {
                  result.push({
                    // isChildOf: header,
                    ...childHeader,
                    userConfig: {},
                  });
                }
              }
            }
          }
        }
      }

      return result;
    },
    flattenedHeadersHideMapField() {
      let result = [];
      for (const header of this.flattenedHeaders) {
        if (!header.meta || !header.meta.hideField) {
          if (!this.superOptions.superOptions) {
            if (
                !header.usageType.startsWith("relLookupMapExtra") &&
                !header.usageType.startsWith("mapExtra")
            ) {
              result.push(header);
            }
          } else {
            result.push(header);
          }
        }
      }
      return result;
    },
  },
  methods: {
    tableRowClassFn(props) {
      let result = "ccc";
      if (this.model.rules.readable(props.row)) {
        result = "hhh";
      }
      return result;
    },
    updateOptions(e) {
      this.$emit("update:options", e);
    },
    deleteItem(e) {
      this.$emit("deleteItem", e);
    },
    editItem(e) {
      this.$emit("editItem", e);
    },
    clickRow(row) {
      if (this.model.rules.readable(row)) {
        this.$emit("clickRow", row[this.model.primaryKey], row);
      }
    },
    onRequest(props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination;
      this.pagination = {
        ...this.pagination,
        page,
        rowsPerPage,
        sortBy,
        descending,
      };
      this.$emit("update:options", {page, rowsPerPage, sortBy, descending});
    },
  },
  watch: {
    options: {
      handler(newOptions) {
        this.pagination = {
          ...this.pagination,
          page: newOptions.page,
          rowsPerPage: newOptions.itemsPerPage,
          sortBy: newOptions.sortBy[0]?.key || this.pKey,
          descending: newOptions.sortBy[0]?.order === "desc" || false,
        };
      },
      deep: true,
    },
    "editItemData.showModal"(arg) {
      if (!arg) {
        this.editItemData.data = {};
      }
    },
  },
  mounted() {
    this.sortBy = [{key: this.pKey, order: "asc"}];
  },
};
</script>

<style scoped>
.qTable .q-tr {
  cursor: pointer;
}

.qTable .q-tr.q-tr--no-hover {
  cursor: unset;
}

.qTable {
  box-shadow: none !important;
}
</style>
