<template>
  <div>
    <!--<pre>{{superOptions}}</pre>-->
    <template v-if="superOptions.canEdit">
      <q-dialog
          v-model="createItemData.showModal"
          @update:modelValue="formServerErrors = {};"
      >
        <!--:parentKeyValuePair="parentKeyValuePair"-->
        <CreateEditForm
            :titlePrefix="`New`"
            v-if="createItemData.showModal"
            v-model="createItemData.data"
            @submit="createItemSubmit"
            @cancel="createItemData.showModal = false; formServerErrors = {};"
            :superOptions="superOptions"
            style="width: 700px; max-width: calc(-32px + 100vw);"
            :template="templateForm"
            :formServerErrors="formServerErrors"
            :submitting="submitting"
        />
      </q-dialog>

      <template v-if="superOptions.canEdit">
        <q-dialog
            v-model="editItemData.showModal"
            @update:modelValue="formServerErrors = {};"
        >
          <CreateEditForm
              titlePrefix="Edit"
              v-if="editItemData.showModal"
              v-model="editItemData.data"
              @submit="editItemSubmit"
              @cancel="editItemData.showModal = false; formServerErrors = {};"
              :superOptions="superOptions"
              :template="templateForm"
              style="width: 700px; max-width: calc(-32px + 100vw);"
              :formServerErrors="formServerErrors"
              :submitting="submitting"
          />
        </q-dialog>

        <q-dialog v-model="deleteItemData.showModal" >
          <q-card style="width: 500px; max-width: calc(-32px + 100vw);">
            <q-card-section class="q-pt-md q-pb-md q-pl-md q-pr-md">
              <div class="text-h6">Delete Item</div>
            </q-card-section>
            <q-card-section>
              <p>Are you sure you want to delete this item?</p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn @click="deleteItemData.showModal = false" flat>Cancel</q-btn>
              <q-btn @click="deleteItemSubmit" color="negative" flat>Delete</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </template>
    </template>
  </div>
</template>

<script>
// import CreateEditForm from "./CreateEditForm.vue";
import QuickListsHelpers from "./QuickListsHelpers";
import {defineAsyncComponent} from "vue";

const AsyncCreateEditFormComponent = defineAsyncComponent(() =>
    import('./CreateEditForm.vue')
);

export default {
  name: "CrudModal",
  components: {
    CreateEditForm: AsyncCreateEditFormComponent,
    // CreateEditForm,
  },
  props: {
    canEdit: false,
    superOptions: {},
    parentKeyValuePair: {},
    templateForm: {},
  },
  data(){
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
    }
  },
  methods: {

    createNewInstance() {
      // return new this.model();
      return new this.superOptions.model();
    },
    createItem() {
      this.createItemData.showModal = true;
    },
    createItemSubmit() {
      if (this.submitting){
        return
      }
      this.submitting = true
      let payload = QuickListsHelpers.preparePayload(
          this.createItemData.data,
          this.superOptions.modelFields,
      );

      delete payload.id;

      // const inititalItemLength = this.items.length;


      let headers = {}
      const hasFileField = this.superOptions.modelFields.find((field) => field.usageType == "fileImageType");
      if (hasFileField){
        headers = {
          'Content-Type': 'multipart/form-data'
        }
      }

      this.superOptions.model.Store(
          {
            ...payload,
            ...this.createPayloadExtras,
          },
          [],
          {},
          headers
      )
          .then((response) => {

            // hook to go here
            if (this.superOptions.model.hooks?.createComplete){
              this.superOptions.model.hooks.createComplete(response)
            }
            this.submitting = false

            // if (!inititalItemLength) {
            //   if (!this.submitting) {
            //   }
            // }



            // this.fetchData();
            this.$emit('fetchData');
            this.$emit('createdItem', response.response.data.data);

            // After handling, reset formData (if needed)
            this.createItemData.data = {};

            // Close the dialog after submission
            this.createItemData.showModal = false;
            this.formServerErrors = {};
          })
          .catch((err) => {
            this.submitting = false
            this.formServerErrors = err.response.data;
          });

    },

    deleteItem(item) {

      this.$emit("deleteItem", item);

      this.deleteItemData.data = item;
      this.deleteItemData.showModal = true;
    },
    deleteItemSubmit() {
      this.superOptions.model.Delete(this.deleteItemData.data.id)
          .then(() => {
            this.$emit('fetchData');
            this.deleteItemData.showModal = false;

            this.$emit("deleteComplete");
          })
          .catch((err) => {
            this.$emit("deleteComplete");
          });
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

      this.superOptions.model.Update(
          payload,
          [],
          {},
          {
            'Content-Type': 'multipart/form-data'
          }
      )
          .then(() => {
            // this.fetchData();
            this.$emit('fetchData');
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

        if (this.parentKeyValuePair.parentFKey && this.parentKeyValuePair.parentFVal) {
          this.createItemData.data[this.parentKeyValuePair.parentFKey] = this.parentKeyValuePair.parentFVal;
        }
      }
    },
  }
}
</script>

<style scoped>

</style>