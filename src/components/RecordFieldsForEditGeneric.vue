<template>
  <div>
    <template v-for="field in superOptions.modelFields" :key="field.name">
      <template v-if="
      superOptions.model.primaryKey !== field.name
      && !field.meta.hideField
      && !['relLookupNormal','relChildrenNormal'].includes(field.usageType)
      && !field.usageType.startsWith('relLookupMap')
        && !field.usageType.startsWith('relForeignKeyMap')
        && !field.usageType.startsWith('mapExtraGeo')
        && !field.usageType.startsWith('mapExtraPlace')
    ">
        <div
          class="q-mb-sm"
         v-show="!(typeof field.fieldExtras.autoFill === 'function')"
        >

          <div v-if="rendered && !field.usageType.startsWith('relLookupMapExtraRel')" class="text-subtitle2" :style="`visibility: ${field.label.length ? 'visible' : 'hidden'}`">
            {{ field.label }}:
          </div>
          <!--:disabled="typeof field.fieldExtras.autoFill === 'function'"-->
          <DatapointForEditInner
              @superTableMounted="rendered = true"
              :item="itemData"
              :modelValue="itemData[field.name]"
              @update:modelValue="(fieldValue)=>{updateModelValue(fieldValue,field.name)}"
              :superOptions="superOptions"
              @updateSetDefaultEndTime="(date)=>{$emit('updateSetDefaultEndTime', date)}"
              :field="field"
              :formServerErrors="formServerErrors"
              :itemErrors="itemErrors"
              hideLabel
              @placeSelected="(e)=>{$emit('placeSelected', e)}"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import DatapointForEditInner from "./DatapointForEditInner.vue";
import SuperSelect from "./SuperSelect.vue";
import RecordFieldsForEditCustom from "./RecordFieldsForEditCustom.vue";

export default {
  name: "RecordFieldsForEditGeneric",
  components: {
    RecordFieldsForEditCustom,
    SuperSelect,
    DatapointForEditInner,
  },
  props: {
    itemErrors: {
      type: Object,
      default: () => ({}),
    },
    formServerErrors: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    superOptions: {
      type: Object,
      default() {
        return {
          headers: [],
          modelFields: [],
          displayMapField: false,
          model: {},
          canEdit: false,
          currentParentRecord: {},
        };
      },
    },
  },
  data() {
    return {
      rendered: false,
      itemData: this.modelValue,
      loading: false,
    };
  },
  mounted() {
    this.itemData = this.modelValue;
    this.autoFillAll()
    // const creatorKey = this.superOptions.modelFields.find((field) => field.usageType == "relForeignKeyCreatorType");
    // if (creatorKey) {
    //   this.itemData[creatorKey.name] = this.superOptions.user.id; // Assuming user has an id property
    // }
  },
  methods: {
    updateModelValue(fieldValue, fieldName){
      this.itemData[fieldName] = fieldValue
      this.$emit('update:modelValue', this.itemData)
    },
    autoFillAll(){
      for (const field of this.superOptions.modelFields) {
        // if (typeof field.fieldExtras.autoFill === 'function' && !this.itemData[field.name]) {
        if (typeof field.fieldExtras.autoFill === 'function') {
          this.itemData[field.name] = field.fieldExtras.autoFill(this.itemData);
        }
      }
      this.$emit("update:modelValue", this.itemData);
    },
  },
  watch: {
    itemData: {
      handler() {
        this.autoFillAll()
      },
      deep: true,
    },
  }
};
</script>

<style scoped></style>
