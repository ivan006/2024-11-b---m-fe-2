<template>
  <div>
    <template v-if="field.dataType === 'uid'"></template>

    <template v-else-if="field.usageType.startsWith('rel')">
      <template v-if="field.usageType.startsWith('relLookup')"></template>

      <template v-else-if="field.usageType.startsWith('relForeignKeyNormal')">
        <!-- Replace complex select components with a simple textarea -->
        <textarea
            v-model="modelValueComputed"
            class="w-full p-2 border rounded-md"
            :placeholder="field.label"
        />
      </template>

      <template v-else-if="field.usageType.startsWith('relForeignKeyMapExtraRel')">
        <!-- Replace SuperTable with a simple textarea -->
        <textarea
            v-model="modelValueComputed"
            class="w-full p-2 border rounded-md"
            :placeholder="field.label"
        />
      </template>

      <template v-else-if="field.usageType == 'relForeignKeyOwnerAppliedToProviderType'">
        <textarea
            v-model="modelValueComputed"
            class="w-full p-2 border rounded-md"
            :placeholder="field.label"
            readonly
        />
      </template>

      <template v-else-if="field.usageType !== 'relChildrenNormal'">
        <textarea
            v-model="modelValueComputed"
            class="w-full p-2 border rounded-md"
            :placeholder="field.label"
        />
      </template>
    </template>

    <!-- Handle time range inputs with a textarea for simplicity -->
    <template v-else-if="field.usageType == 'timeRangeType'">
      <textarea
          v-model="modelValueComputed"
          class="w-full p-2 border rounded-md"
          :placeholder="compPlaceholder"
      />
    </template>

    <template v-else-if="field.usageType == 'timestampType'">
      <textarea
          v-model="modelValueComputed"
          class="w-full p-2 border rounded-md"
          type="datetime-local"
          :placeholder="compPlaceholder"
      />
    </template>

    <template v-else-if="field.usageType == 'dateType'">
      <textarea
          v-model="modelValueComputed"
          class="w-full p-2 border rounded-md"
          type="date"
          :placeholder="compPlaceholder"
      />
    </template>

    <template v-else-if="field.usageType.startsWith('fileImageType')">
      <template v-if="itemPVal">
        <div class="q-mb-md">
          <div class="bg-grey-200 p-4 text-center">
            <template v-if="typeof modelValue === 'string' && modelValue.length">
              <img
                  :src="modelValue"
                  alt="File not found."
                  class="max-w-full max-h-48"
              />
            </template>
            <template v-else> Images can only be set on create. </template>
          </div>
        </div>
      </template>

      <template v-else>
        <input
            type="file"
            @change="handleFileUpload"
            accept=".pdf,.jpg,.jpeg,.png"
            class="w-full p-2 border rounded-md"
        />
      </template>
    </template>

    <!-- For text fields, use a simple textarea -->
    <template v-else-if="field.usageType === 'normal'">
      <template v-if="field.dataType === 'string'">
        <textarea
            v-model="modelValueComputed"
            class="w-full p-2 border rounded-md"
            :placeholder="compPlaceholder"
        />
      </template>

      <template v-else-if="field.dataType === 'boolean'">
        <textarea
            v-model="modelValueComputed"
            class="w-full p-2 border rounded-md"
            :placeholder="compPlaceholder"
        />
      </template>

      <template v-else-if="field.dataType === 'number'">
        <textarea
            v-model="modelValueComputed"
            class="w-full p-2 border rounded-md"
            type="number"
            :placeholder="compPlaceholder"
        />
      </template>

      <template v-else-if="field.dataType === 'attr'">
        <textarea
            v-model="modelValueComputed"
            class="w-full p-2 border rounded-md"
            :placeholder="compPlaceholder"
        />
      </template>
    </template>

    <!-- Default to textarea for unknown types -->
    <template v-else>
      <textarea
          v-model="modelValueComputed"
          class="w-full p-2 border rounded-md"
          :placeholder="compPlaceholder"
      />
    </template>
  </div>
</template>


<script>
import RelationComponent from "./RelationComponent.vue";
import DateAndTimeRangePicker from "./DateAndTimeRangePicker.vue";
import DateAndTimePicker from "./DateAndTimePicker.vue";
import QuickListsHelpers from "./QuickListsHelpers";
import SuperSelect from "./SuperSelect.vue";
// import SuperTable from "./SuperTable.vue";
import {defineAsyncComponent} from "vue";

const AsyncSuperTableComponent = defineAsyncComponent(
    () => import("./SuperTable.vue"),
);

export default {
  name: "DatapointForEditInner",
  components: {
    SuperSelect,
    DateAndTimePicker,
    DateAndTimeRangePicker,
    RelationComponent,
    // SuperTable,
    // SuperTable: () => import("./SuperTable.vue"),
    SuperTable: AsyncSuperTableComponent,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    itemErrors: {
      type: Object,
      default: () => ({}),
    },
    formServerErrors: {
      type: Object,
      default: () => ({}),
    },
    hideLabel: {
      type: Boolean,
      default() {
        return false;
      },
    },
    modelValue: {
      type: [Object, String, Number, Boolean],
      default() {
        return null;
      },
    },
    field: {
      type: Object,
      default() {
        return {};
      },
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
      loading: false,
    };
  },
  computed: {
    modelValueComputed: {
      get() {
        // Return the value of the modelValue prop
        return this.modelValue;
      },
      set(value) {
        // Emit the updated value to the parent component
        this.$emit("update:modelValue", value);
      }
    },
    itemPVal() {
      const result = this.item[this.superOptions.model.primaryKey];
      return result;
    },
    compServerError() {
      let result = null;
      if (
          this.formServerErrors &&
          this.formServerErrors.errors &&
          this.formServerErrors.errors[this.field.name]
      ) {
        result = this.formServerErrors.errors[this.field.name];
      }
      return result;
    },
    compError() {
      let result = null;
      if (
          this.itemErrors &&
          this.itemErrors &&
          this.itemErrors[this.field.name]
      ) {
        result = `${this.field.label} is required.`;
      }
      return result;
    },
    compLabel() {
      // if (this.hideLabel){
      //   return void 0
      // } else {
      //   return this.field.label
      // }

      return void 0;
    },
    compPlaceholder() {
      // if (this.hideLabel){
      //   return this.field.label
      // } else {
      //   return void 0
      // }
      return this.field.label;
    },
  },
  methods: {
    getForcedFilters(field) {
      if (typeof field.fieldExtras.linkablesRule === "function") {
        return field.fieldExtras.linkablesRule();
      }
      return {};
    },
    handleFileUpload(file) {
      if (file) {
        this.$emit("update:modelValue", file);
      }
    },
    updateModelValue(item) {
      this.$emit("update:modelValue", item);
    },
    updateForeignKey(item) {
      this.$emit("update:modelValue", item);
    },
    updateStartTime(item) {
      this.$emit("update:modelValue", item);
      this.$emit("updateSetDefaultEndTime", item);
    },
  },
  mounted() {
    // const creatorKey = this.superOptions.modelFields.find((field) => field.usageType == "relForeignKeyCreatorType");
    // if (creatorKey) {
    //   this.itemData[creatorKey.name] = this.superOptions.user.id; // Assuming user has an id property
    // }
  },
};
</script>

<style scoped></style>
