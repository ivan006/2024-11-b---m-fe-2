<template>
  <div>
    <template v-if="superOptions.canEdit">
      <!-- Create Modal -->
      <div v-if="createItemData.showModal" class="fixed inset-0 z-50 overflow-auto bg-smoke-light flex justify-center items-center">
        <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full">
          <CreateEditForm
              :titlePrefix="'New'"
              v-model="createItemData.data"
              @submit="createItemSubmit"
              :superOptions="superOptions"
              :template="templateForm"
              :formServerErrors="formServerErrors"
              :submitting="submitting"
          />
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="editItemData.showModal" class="fixed inset-0 z-50 overflow-auto bg-smoke-light flex justify-center items-center">
        <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full">
          <CreateEditForm
              titlePrefix="Edit"
              v-model="editItemData.data"
              @submit="editItemSubmit"
              :superOptions="superOptions"
              :template="templateForm"
              :formServerErrors="formServerErrors"
              :submitting="submitting"
          />
        </div>
      </div>

      <!-- Delete Modal -->
      <div v-if="deleteItemData.showModal" class="fixed inset-0 z-50 overflow-auto bg-smoke-light flex justify-center items-center">
        <div class="bg-white rounded-lg shadow-lg max-w-lg w-full">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Delete Item</h2>
            <p>Are you sure you want to delete this item?</p>
            <div class="mt-4 flex justify-end">
              <button @click="deleteItemData.showModal = false" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">Cancel</button>
              <button @click="deleteItemSubmit" class="px-4 py-2 bg-red-500 text-white rounded-md ml-2">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import QuickListsHelpers from "./QuickListsHelpers";
import { defineAsyncComponent } from "vue";

const AsyncCreateEditFormComponent = defineAsyncComponent(() =>
    import("./CreateEditForm.vue")
);

export default {
  name: "CrudModal",
  components: {
    CreateEditForm: AsyncCreateEditFormComponent,
  },
  props: {
    canEdit: {
      type: Boolean,
      default: false,
    },
    superOptions: Object,
    parentKeyValuePair: Object,
    templateForm: Object,
  },
  data() {
    return {
      submitting: false,
      formServerErrors: {},
      deleteItemData: {
        showModal: false,
        data: null,
      },
      editItemData: {
        showModal: false,
        data: null,
      },
      createItemData: {
        showModal: false,
        data: {},
      },
    };
  },
  methods: {
    createNewInstance() {
      return new this.superOptions.model();
    },
    createItem() {
      this.createItemData.showModal = true;
    },
    createItemSubmit() {
      if (this.submitting) return;
      this.submitting = true;
      let payload = QuickListsHelpers.preparePayload(
          this.createItemData.data,
          this.superOptions.modelFields
      );

      delete payload.id;

      let headers = {};
      const hasFileField = this.superOptions.modelFields.find(
          (field) => field.usageType === "fileImageType"
      );
      if (hasFileField) {
        headers = {
          "Content-Type": "multipart/form-data",
        };
      }

      this.superOptions.model
          .Store(
              { ...payload, ...this.createPayloadExtras },
              [],
              {},
              headers
          )
          .then((response) => {
            if (this.superOptions.model.hooks?.createComplete) {
              this.superOptions.model.hooks.createComplete(response);
            }
            this.submitting = false;
            this.$emit("fetchData");
            this.$emit("createdItem", response.response.data.data);
            this.createItemData.data = {};
            this.createItemData.showModal = false;
            this.formServerErrors = {};
          })
          .catch((err) => {
            this.submitting = false;
            this.formServerErrors = err.response.data;
          });
    },
    deleteItem(item) {
      this.$emit("deleteItem", item);
      this.deleteItemData.data = item;
      this.deleteItemData.showModal = true;
    },
    deleteItemSubmit() {
      this.superOptions.model
          .Delete(this.deleteItemData.data.id)
          .then(() => {
            this.$emit("fetchData");
            this.deleteItemData.showModal = false;
            this.$emit("deleteComplete");
          })
          .catch((err) => {
            this.$emit("deleteComplete");
          });
    },
    editItem(item) {
      this.$emit("editItem", item);
      this.editItemData.data = { ...item };
      this.editItemData.showModal = true;
    },
    editItemSubmit() {
      const payload = QuickListsHelpers.preparePayload(
          this.editItemData.data,
          this.superOptions.modelFields
      );

      this.superOptions.model
          .Update(payload, [], {}, { "Content-Type": "multipart/form-data" })
          .then(() => {
            this.$emit("fetchData");
            this.editItemData.showModal = false;
            this.formServerErrors = {};
            this.$emit("editComplete");
          })
          .catch((err) => {
            this.formServerErrors = err.response.data;
            this.$emit("editComplete");
          });
    },
  },
  watch: {
    "createItemData.showModal"(arg) {
      if (arg) {
        this.createItemData.data = this.createNewInstance();
        if (
            this.parentKeyValuePair.parentFKey &&
            this.parentKeyValuePair.parentFVal
        ) {
          this.createItemData.data[this.parentKeyValuePair.parentFKey] =
              this.parentKeyValuePair.parentFVal;
        }
      }
    },
  },
};
</script>

<style scoped>
/* Scoped styles for modals, buttons, etc., can go here */
</style>
