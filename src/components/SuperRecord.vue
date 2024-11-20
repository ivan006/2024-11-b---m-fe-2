<template>
  <div>
    <div>
      <!-- Tab navigation using Preline -->
      <div v-if="this.allowedTabs.length !== 1">
        <ul class="flex border-b-2">
          <li v-for="(relation, index) in filteredChildRelations" :key="index" :class="{'mr-4': true}">
            <button
                class="px-4 py-2 border-b-2"
                :class="activeTab === `tab-${index}` ? 'border-blue-500' : 'border-transparent'"
                @click="activeTab = `tab-${index}`"
            >
              {{ relation.field.label }}
            </button>
          </li>
          <li v-if="this.allowedTabs.length === 0 || this.allowedTabs.includes('overview')" class="mr-4">
            <button
                class="px-4 py-2 border-b-2"
                :class="activeTab === 'tab-overview' ? 'border-blue-500' : 'border-transparent'"
                @click="activeTab = 'tab-overview'"
            >
              Overview
            </button>
          </li>
        </ul>
      </div>

      <!-- Tab panels using Preline -->
      <div class="tab-panels mt-4">
        <div v-if="activeTab === 'tab-overview'"
             v-show="this.allowedTabs.length === 0 || this.allowedTabs.includes('overview')">
          <template v-if="!loading">
            <OverviewTab
                :item="item"
                :superOptions="superOptions"
                :templateOverview="templateOverview"
                :filteredChildRelations="filteredChildRelations"
                :childRelations="childRelations"
                @editItem="editItem"
                @deleteItem="deleteItem"
            >
              <template v-for="(slot, slotName) in $slots" v-slot:[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps"></slot>
              </template>
            </OverviewTab>
          </template>
          <template v-else>
            <div class="text-center p-4">Loading...</div>
          </template>
        </div>


        <div v-if="activeTab === 'tab-map'"
             v-show="someChildrenCanBeMapped && (this.allowedTabs.length === 0 || this.allowedTabs.includes('map'))">
          <!-- Map content here -->
        </div>

        <!-- Child Relations Tab -->
        <div v-for="(relation, index) in filteredChildRelations" :key="index" v-show="activeTab === `tab-${index}`">
          <SuperTable
              :ref="`tab-${index}`"
              :parentKeyValuePair="parentKeyValuePair(relation)"
              :model="relation.field.meta.field.related"
              :canEdit="canEdit"
              :forcedFilters="filters(relation)"
              @clickRow="(pVal, item) => {clickRow(pVal, item, relation)}"
          >
            <template v-if="$slots[relation.field.name]" v-slot:create>
              <slot :name="relation.field.name"/>
            </template>
          </SuperTable>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <template v-if="canEdit">
      <template v-if="superOptions.canEdit">
        <div v-if="editItemData.showModal" class="modal">
          <CreateEditForm
              titlePrefix="Edit"
              v-model="editItemData.data"
              @submit="editItemSubmit"
              @cancel="editItemData.showModal = false; formServerErrors = {};"
              :superOptions="superOptions"
              :template="templateForm"
              class="w-3/4 max-w-lg"
              :formServerErrors="formServerErrors"
          />
        </div>

        <!-- Delete Modal -->
        <div v-if="deleteItemData.showModal" class="modal">
          <div class="modal-content">
            <div class="text-xl font-bold">Delete Item</div>
            <p>Are you sure you want to delete this item?</p>
            <div class="modal-actions">
              <button @click="deleteItemData.showModal = false" class="btn btn-flat">Cancel</button>
              <button @click="deleteItemSubmit" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>


<script>
import SuperTable from "./SuperTable.vue";
import RecordFieldsForDisplayGeneric from "./RecordFieldsForDisplayGeneric.vue";
import QuickListsHelpers from "./QuickListsHelpers";
import RecordFieldsForDisplayCustom from "./RecordFieldsForDisplayCustom.vue";
// import SuperTableTable from "./SuperTableTable.vue";
import OverviewTab from "./OverviewTab.vue";
import {defineAsyncComponent} from "vue";
import Helpers from "./Helpers";
const AsyncCreateEditFormComponent = defineAsyncComponent(() =>
    import('./CreateEditForm.vue')
);

export default {
  name: "SuperRecord",
  components: {
    CreateEditForm: AsyncCreateEditFormComponent,
    OverviewTab,
    RecordFieldsForDisplayCustom,
    RecordFieldsForDisplayGeneric,
    SuperTable,
  },
  props: {
    allowedTabs: {
      type: Array,
      default() {
        return [];
      },
    },
    templateOverview: {
      type: Object,
      default() {
        return {};
      },
    },
    templateForm: {
      type: Object,
      default() {
        return {};
      },
    },
    model: {
      type: [Object, Function],
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    displayMapField: {
      type: Boolean,
      default: false,
    },
    relationships: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      deleteItemData: {
        showModal: false,
        data: null,
      },
      editItemData: {
        showModal: false,
        data: null,
      },
      activeTab: 'tab-overview',
      loading: true,
      initialLoadHappened: false,
      item: {},
      formServerErrors: {},
    };
  },
  computed: {

    someChildrenCanBeMapped() {
      return this.childRelations.some(
          child =>  child.canBeMapped
      )
    },
    superOptions() {
      return {
        headers: this.headers,
        modelFields: this.modelFields,
        displayMapField: this.displayMapField,
        model: this.model,
        canEdit: this.canEdit,
      };
    },
    fieldsUsedInOverview() {
      // let result = {
      //   dataIndicators: [],
      //   cols: [],
      // };
      const result = []
      if (this.templateOverview && this.templateOverview.cols) {
        for (const col of this.templateOverview.cols) {
          if (col.cols) {
            for (const col2 of col.cols) {
              if (col2.dataPoint.field) {
                result.push(col2.dataPoint.field);
              }
            }
          } else {
            if (col.dataPoint.field) {
              result.push(col.dataPoint.field);
            }
          }
        }
      }

      return result;
    },
    canEdit() {
      return true;
    },
    childRelations() {
      const fields = QuickListsHelpers.computedAttrs(this.model, []);
      const result = [];

      for (let fieldName in fields) {
        const field = fields[fieldName];
        if (field.usageType.startsWith("relChildren")) {
          const child = {
            field,

            // currentParentRecord: {
            //   item: this.item,
            //   model: this.model,
            //   relationType: field.usageType,
            //   foreignKeyToParentRecord: field.meta.field.foreignKey,
            // },
          }

          const headers = QuickListsHelpers.SupaerTableHeaders(
              field.meta.field.related,
              [this.parentKeyValuePair({field}).parentFKey],
          )

          const startfield = Helpers.getFieldFromModelOrParent(headers, 'timeRangeStart');

          if (startfield){
            child.canBeCalendared = true
          } else {
            child.canBeCalendared = false
          }

          let longField = Helpers.getFieldFromModelOrParent(headers, 'mapExtraGeoLocLong');

          if (longField){
            child.canBeMapped = true
          } else {
            child.canBeMapped = false
          }

          child.superOptions = {
            headers,
            modelFields: QuickListsHelpers.computedAttrs(
                field.meta.field.related,
                [this.parentKeyValuePair({field}).parentFKey],
            ),
            displayMapField: false,
            model: field.meta.field.related,
            canEdit: field.meta.field.related.rules.creatable()
          }
          // console.log('field')
          // console.log(child.superOptions)

          result.push(child);
        }
      }

      return result;
    },
    filteredChildRelations() {
      let result = [];
      if (!this.allowedTabs){
      }
      for (const childRelation of this.childRelations) {
        if (
            !this.fieldsUsedInOverview.includes(childRelation.field.name)
            && (this.allowedTabs.length === 0 || this.allowedTabs.includes(childRelation.field.name))
        ) {
          result.push(childRelation);
        }
      }
      return result;
    },
    headers() {
      return QuickListsHelpers.SupaerTableHeaders(this.model, [], this.canEdit, this.displayMapField);
    },
    // item() {
    //   return this.model.query().whereId(this.id).withAll().get()[0];
    // },
    modelFields() {
      return QuickListsHelpers.computedAttrs(this.model, []);
    },
  },
  methods: {
    clickRow(pVal, item, relation) {
      relation.field.meta.field.related.openRecord(pVal, item, this.$router)
    },
    parentKeyValuePair(relation) {
      const fKey = relation.field.meta.field.foreignKey

      const result = {
        parentFKey: fKey,
        parentFVal: this.item[this.model.primaryKey],
        parentItem: this.item,
      }
      return result
    },
    deleteItem(item) {

      this.$emit("deleteItem", item);

      this.deleteItemData.data = item;
      this.deleteItemData.showModal = true;
    },
    deleteItemSubmit() {
      this.superOptions.model.Delete(this.deleteItemData.data.id).then(() => {
        this.fetchData();
      });
      this.deleteItemData.showModal = false;
    },
    editItem(item) {
      this.$emit("editItem", item);

      this.editItemData.data = {...item};
      this.editItemData.showModal = true;
    },
    editItemSubmit() {
      const payload = QuickListsHelpers.preparePayload(
          this.editItemData.data,
          this.superOptions.modelFields
      );

      this.superOptions.model.Update(payload)
          .then(() => {
            this.fetchData();
            this.editItemData.showModal = false;
            this.formServerErrors = {};
          })
          .catch((err) => {
            this.formServerErrors = err.response.data;
          });
    },
    getMsg(type) {
      if (Array.isArray(type)) {
        return type.length > 1
            ? `To create first set your active ${type[0]} group and active ${type[1]} group`
            : "";
      } else {
        return `To create first set your active ${type} group`;
      }
    },
    filters(relation) {
      const parentKeyValuePair = this.parentKeyValuePair(relation)

      return {
        [parentKeyValuePair.parentFKey]: parentKeyValuePair.parentFVal,
      };
    },
    fetchData() {
      this.loading = true
      this.model
          .FetchById(
              this.id,
              this.relationships,
              { flags: {}, moreHeaders: {}, rels: [] }
          )
          .then((response) => {

            this.item = response.response.data.data
            this.loading = false
            this.initialLoadHappened = true;
            this.$emit("initialLoadHappened", true);
          })
          .catch(() => {
            this.loading = false
            this.initialLoadHappened = true;
            this.$emit("initialLoadHappened", true);
          });
    },
  },
  mounted() {
    if(this.allowedTabs.length){
      this.activeTab = `tab-${this.allowedTabs[0]}`
    }
    this.fetchData();
  },
  watch: {
    activeTab(newVal) {
      this.$nextTick(() => {
        if (this.$refs[newVal]) {
          this.$refs[newVal][0].fetchData();
        }
      });
    },
    item(newVal) {
      if (Object.keys(newVal).length !== 0){
        this.$emit('update:item', newVal)
      }
    },
  }
};
</script>

<style>
.SuperRecorSingleTabOnly .q-tab-panel {
    padding: 0;

}
</style>
