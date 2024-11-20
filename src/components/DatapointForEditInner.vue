<template>
  <div>
    <!--<pre>{{formServerErrors}}</pre>-->
    <!--<pre>{{compServerError}}</pre>-->
    <template v-if="field.dataType === 'uid'"></template>
    <template v-else-if="field.usageType.startsWith('rel')">
      <template v-if="field.usageType.startsWith('relLookup')"></template>
      <template v-else-if="field.usageType.startsWith('relForeignKeyNormal')">
        <!--<SuperSelect-->
        <!--    :modelField="field"-->
        <!--    :modelValue="modelValue"-->
        <!--    :model="field.meta.field.parent"-->
        <!--    variant="filled"-->
        <!--    density="default"-->
        <!--    :user="superOptions.user"-->
        <!--    :rules="[() => true]"-->
        <!--/>-->

        <!--<RelationComponent-->
        <!--    :configs="field"-->
        <!--    :modelValue="modelValue"-->
        <!--    readonly-->
        <!--    :rules="[() => true]"-->
        <!--/>-->

        <SuperTable
            :disabled="disabled"
            :hideLabel="hideLabel"
            :isForSelectingRelation="true"
            :canEdit="false"
            :modelValue="modelValue"
            @update:modelValue="updateModelValue"
            :model="field.meta.field.parent"
            :rules="[() => true]"
            :modelField="field"
            :fetchFlags="{
            sort: field.meta.field.parent.titleKey,
          }"
            :forcedFilters="getForcedFilters(field)"
            @superTableMounted="$emit('superTableMounted')"
            :errorMessage="compError"
        />
        <!--parentKeyValuePair-->
      </template>
      <template
          v-else-if="field.usageType.startsWith('relForeignKeyMapExtraRel')"
      >
        <SuperTable
            :hideLabel="hideLabel"
            :isForSelectingRelation="true"
            :canEdit="false"
            :modelValue="modelValue"
            @update:modelValue="
            (newValue) => {
              updateModelValue(newValue);
              updateForeignKey(newValue);
            }
          "
            :model="field.meta.field.parent"
            :rules="[() => true]"
            :modelField="field"
            :fetchFlags="{
            sort: field.meta.field.parent.titleKey,
          }"
            :forcedFilters="getForcedFilters(field)"
            @superTableMounted="$emit('superTableMounted')"
            :errorMessage="compError"
            disabled
        />
      </template>
      <template
          v-else-if="field.usageType == 'relForeignKeyOwnerAppliedToProviderType'"
      >
        <SuperSelect
            :hideLabel="hideLabel"
            :modelField="field"
            :modelValue="modelValue"
            @update:modelValue="updateModelValue"
            :model="field.meta.field.parent"
            readonly
            variant="filled"
            density="default"
        />
        <!--:user="superOptions.user"-->
      </template>
      <template v-else-if="field.usageType !== 'relChildrenNormal'">
        <RelationComponent
            :hideLabel="hideLabel"
            :configs="field"
            :modelValue="modelValue"
            @update:modelValue="updateModelValue"
        />
      </template>
    </template>
    <template v-else-if="field.usageType == 'timeRangeType'">
      <DateAndTimeRangePicker
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
      />
    </template>
    <template v-else-if="field.usageType == 'timeRangeStart'">
      <DateAndTimePicker
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateStartTime"
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
      />
    </template>
    <template v-else-if="field.usageType == 'timeRangeEnd'">
      <DateAndTimePicker
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
      />
    </template>
    <template v-else-if="field.usageType == 'timestampType'">
      <!--<DateAndTimePicker-->
      <!--    :label="compLabel"-->
      <!--      :placeholder="compPlaceholder"-->
      <!--    :modelValue="modelValue"-->
      <!--    @update:modelValue="updateModelValue"-->
      <!--    :rules="field.meta.rules"-->
      <!--    :error="!!compError"-->
      <!--    :error-message="compError"-->
      <!--/>-->
      <q-input
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
          type="datetime-local"
          filled
          dense
      />
    </template>
    <template v-else-if="field.usageType == 'dateType'">
      <q-input
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
          type="date"
          filled
          dense
      />
    </template>
    <template v-else-if="field.usageType.startsWith('fileImageType')">
      <!--<template  v-if="typeof modelValue === 'string' && modelValue.length">-->
      <template v-if="itemPVal">
        <div class="q-mb-md">
          <q-card style="width: unset; max-width: unset" flat class="bg-grey-2">
            <q-card-section class="q-pa-sm" style="text-align: center">
              <template
                  v-if="typeof modelValue === 'string' && modelValue.length"
              >
                <!--:src="`${superOptions.model?.fileUrlPrefix}/${modelValue}`"-->
                <img
                    :src="`${modelValue}`"
                    alt="File not found."
                    style="max-width: 100%; max-height: 200px"
                />
              </template>
              <template v-else> Images can only be set on create. </template>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-else>
        <q-file
            :modelValue="modelValue"
            @update:modelValue="handleFileUpload"
            :label="compLabel"
            accept=".pdf,.jpg,.jpeg,.png"
            :error="!!compError"
            :error-message="compError"
            class="q-mb-md"
            filled
            dense
        >
          <!--@change="handleFileUpload"-->
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </template>
    </template>
    <template v-else-if="field.usageType.startsWith('htmlField')">
      <q-editor
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          :toolbar="[
          ['bold', 'italic', 'underline', 'strike'],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
          ['link', 'image', 'hr'],
          ['undo', 'redo'],
        ]"
          :label="compLabel"
          :error="!!compError"
          :error-message="compError"
          dense
          :placeholder="compPlaceholder"
          :rules="field.meta.rules"
          filled
      />
    </template>
    <template
        v-else-if="
        field.usageType.startsWith('staticLookup') &&
        field.fieldExtras.usageTypeExtras?.options
      "
    >
      <q-select
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          option-label="label"
          option-value="value"
          emitValue
          mapOptions
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
          :options="field.fieldExtras.usageTypeExtras.options"
          filled
          dense
      />
    </template>
    <template v-else-if="field.usageType == 'readOnlyTimestampType'">
      <DateAndTimePicker
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
          disabled
      />
    </template>
    <template v-else-if="field.usageType === 'location_address_place_name'">
      <SearchGooglePlace
          :hideLabel="hideLabel"
          :configs="field"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          @placeSelected="
          (e) => {
            $emit('placeSelected', e);
          }
        "
      />
      <!--@change="searchGooglePlace"-->
    </template>
    <template v-else-if="field.usageType.startsWith('mapExtra')">
      <q-input
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
          filled
          dense
      />
      <!--readonly-->
      <!--style="display: none"-->
    </template>
    <template v-else-if="field.usageType == 'normal'">
      <template v-if="field.dataType === 'string'">
        <q-input
            :label="compLabel"
            :placeholder="compPlaceholder"
            :modelValue="modelValue"
            @update:modelValue="updateModelValue"
            :rules="field.meta.rules"
            :error="!!compError"
            :error-message="compError"
            filled
            dense
        />
      </template>
      <template v-else-if="field.dataType === 'boolean'">
        <q-checkbox
            :label="compLabel"
            :placeholder="compPlaceholder"
            :modelValue="modelValue"
            @update:modelValue="updateModelValue"
            :rules="field.meta.rules"
            :error="!!compError"
            :error-message="compError"
        />
      </template>
      <template v-else-if="field.dataType === 'number'">
        <q-input
            :label="compLabel"
            :placeholder="compPlaceholder"
            :modelValue="modelValue"
            @update:modelValue="updateModelValue"
            :rules="field.meta.rules"
            :error="!!compError"
            :error-message="compError"
            type="number"
            filled
            dense
        />
      </template>
      <template v-else-if="field.dataType === 'attr'">
        <q-input
            :label="compLabel"
            :placeholder="compPlaceholder"
            :modelValue="modelValue"
            @update:modelValue="updateModelValue"
            :rules="field.meta.rules"
            :error="!!compError"
            :error-message="compError"
            filled
            dense
        />
      </template>
    </template>
    <template v-else>
      <q-input
          :label="compLabel"
          :placeholder="compPlaceholder"
          :modelValue="modelValue"
          @update:modelValue="updateModelValue"
          :rules="field.meta.rules"
          :error="!!compError"
          :error-message="compError"
          filled
          dense
      />
    </template>
  </div>
</template>

<script>
import RelationComponent from "./RelationComponent.vue";
import DateAndTimeRangePicker from "./DateAndTimeRangePicker.vue";
import DateAndTimePicker from "./DateAndTimePicker.vue";
import SearchGooglePlace from "./SearchGooglePlace.vue";
import QuickListsHelpers from "./QuickListsHelpers";
import SuperSelect from "./SuperSelect.vue";
// import SuperTable from "./SuperTable.vue";
import { defineAsyncComponent } from "vue";

const AsyncSuperTableComponent = defineAsyncComponent(
    () => import("./SuperTable.vue"),
);

export default {
  name: "DatapointForEditInner",
  components: {
    SuperSelect,
    SearchGooglePlace,
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
