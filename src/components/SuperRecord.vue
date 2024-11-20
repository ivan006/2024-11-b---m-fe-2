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
import OverviewTab from "./OverviewTab.vue";
import CreateEditForm from "./CreateEditForm.vue";

export default {
  name: "SuperRecord",
  components: {
    OverviewTab,
    SuperTable,
    CreateEditForm,
  },
  props: {
    allowedTabs: Array,
    templateOverview: Object,
    templateForm: Object,
    model: [Object, Function],
    id: Number,
    displayMapField: Boolean,
    relationships: Array,
  },
  data() {
    return {
      deleteItemData: {showModal: false, data: null},
      editItemData: {showModal: false, data: null},
      activeTab: "tab-overview",
      loading: true,
      item: {},
      formServerErrors: {},
    };
  },
  computed: {
    filteredChildRelations() {
      return this.childRelations.filter(relation => this.allowedTabs.includes(relation.field.name));
    },
    canEdit() {
      return true; // Update based on your logic
    },
    childRelations() {
      return this.modelFields; // Adjust logic based on actual data
    },
    superOptions() {
      return {
        headers: this.headers,
        modelFields: this.modelFields,
        displayMapField: this.displayMapField,
        model: this.model,
        canEdit: this.canEdit
      };
    },
    modelFields() {
      return this.model.fields || []; // Adjust based on actual data
    },
  },
  methods: {
    clickRow(pVal, item, relation) {
      console.log(pVal, item, relation);
    },
    editItemSubmit() {
      // Edit item logic
    },
    deleteItemSubmit() {
      // Delete item logic
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // Fetch data logic
    }
  },
};
</script>

<style scoped>
/* Add your Preline-based styles here */
</style>
