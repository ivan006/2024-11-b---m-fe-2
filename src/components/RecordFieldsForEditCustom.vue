<template>
  <div :class="colClasses(template.width ? template.width : 12)" >

    <div style="padding-top:0.03px;">
      <div
          class="row "
         :class="`${template.unsetGutters ? '' : 'q-col-gutter-xs'} ${template.class?.length ? template.class : ''} `"
         :style="`${template.style?.length ? template.style : ''}`"
      >

        <template v-if="template.cols?.length">

          <!--<template v-for="(col, index2) in template.cols" :key="index2">-->


          <!--  <RecordFieldsForDisplayCustom-->
          <!--      :template="col"-->
          <!--      :item="item"-->
          <!--      :childRelations="childRelations"-->
          <!--      :superOptions="superOptions"-->
          <!--      :clickable="clickable"-->
          <!--      @editItem="editItem"-->
          <!--      @deleteItem="deleteItem"-->
          <!--  >-->
          <!--    <template v-for="(slot, slotName) in $slots" v-slot:[slotName]="slotProps">-->
          <!--      <slot :name="slotName" v-bind="slotProps"></slot>-->
          <!--    </template>-->
          <!--  </RecordFieldsForDisplayCustom>-->
          <!--</template>-->

          <!--<template v-for="field in superOptions.modelFields" :key="field.name">-->
          <!--  <template v-if="superOptions.model.primaryKey !== field.name">-->
          <!--    <RecordFieldsForEditCustom-->
          <!--        :modelValue="modelValue"-->
          <!--        @update:modelValue="updateModelValue"-->
          <!--        :superOptions="superOptions"-->
          <!--        @updateSetDefaultEndTime="(date)=>{$emit('updateSetDefaultEndTime', date)}"-->
          <!--        :template="template"-->
          <!--    />-->
          <!--  </template>-->
          <!--</template>-->

          <template  v-for="(col, index2) in template.cols" :key="index2">
            <RecordFieldsForEditCustom
                :modelValue="modelValue"
                @update:modelValue="updateModelValue"
                :superOptions="superOptions"
                @updateSetDefaultEndTime="(date)=>{$emit('updateSetDefaultEndTime', date)}"
                :template="col"
                :formServerErrors="formServerErrors"
                :itemErrors="itemErrors"
                @placeSelected="(e)=>{$emit('placeSelected', e)}"
            />
          </template>
        </template>
        <template v-else-if="template.dataPoint && (compField.meta && !compField.meta.hideField)">
          <div class="col-12">
            <div :class="template.dataPoint.noMargin ? '' : 'q-mb-sm'">
              <DatapointForEdit
                  :modelValue="modelValue"
                  :compField="compField"
                  @update:modelValue="updateModelValue"
                  :superOptions="superOptions"
                  @updateSetDefaultEndTime="(date)=>{$emit('updateSetDefaultEndTime', date)}"
                  :dataPoint="template.dataPoint"
                  :formServerErrors="formServerErrors"
                  :itemErrors="itemErrors"
                  @placeSelected="(e)=>{$emit('placeSelected', e)}"
              />
            </div>
          </div>
        </template>
      </div>
    </div>


  </div>
</template>

<script>
import DatapointForEditInner from "./DatapointForEditInner.vue";
import SuperSelect from "./SuperSelect.vue";
import RecordFieldsForDisplayCustom from "./RecordFieldsForDisplayCustom.vue";
import DatapointForDisplay from "./DatapointForDisplay.vue";
import DatapointForEdit from "./DatapointForEdit.vue";

export default {
  name: "RecordFieldsForEditCustom",
  components: {
    DatapointForEdit,
    DatapointForDisplay, RecordFieldsForDisplayCustom,
    SuperSelect,
    DatapointForEditInner,
  },
  props: {
    formServerErrors: {
      type: Object,
      default: () => ({}),
    },
    itemErrors: {
      type: Object,
      default: () => ({}),
    },
    template: {
      type: Object,
      default() {
        return {};
      },
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
      // itemData: {},
      loading: false,
    };
  },
  computed:{

    compField() {
      if (this.template.dataPoint?.type === 'function') {
        return { label: this.template.dataPoint.label };
      } else {
        const result = this.superOptions.modelFields.find((header) => {
          return header.field == this.template.dataPoint.field
        })
        return result
      }
    },
  },
  mounted() {
    // this.itemData = this.modelValue;
    // const creatorKey = this.superOptions.modelFields.find((field) => field.usageType == "relForeignKeyCreatorType");
    // if (creatorKey) {
    //   this.itemData[creatorKey.name] = this.superOptions.user.id; // Assuming user has an id property
    // }
  },
  methods: {
    colClasses(baseWidth = 12) {
      baseWidth = +baseWidth


      // Coefficients for each breakpoint
      const coefficients = {
        lg: 1,   // Large screens
        md: 1.5, // Medium screens
        sm: 2,   // Small screens
        xs: 4    // Extra small screens
      };

      // Rounding function to the nearest value from the set [1, 2, 3, 4, 6, 12]
      function roundToNearestSet(value) {
        // return Math.min(Math.round(value), 12)
        const set = [1, 2, 3, 4, 6, 12];
        return set.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
      }

      // Calculate widths based on coefficients and round them
      const lg = roundToNearestSet(baseWidth * coefficients.lg);
      const md = roundToNearestSet(baseWidth * coefficients.md);
      const sm = roundToNearestSet(baseWidth * coefficients.sm);
      const xs = roundToNearestSet(baseWidth * coefficients.xs);

      return `col-${lg} col-lg-${lg} col-md-${md} col-sm-${sm} col-xs-${xs}`;
    },
    updateModelValue(item) {
      this.$emit("update:modelValue", item);
    },
  },
  watch: {
    // itemData: {
    //   handler(newValue) {
    //     this.$emit("update:modelValue", newValue);
    //   },
    //   deep: true,
    // },
  },
};
</script>

<style scoped></style>
