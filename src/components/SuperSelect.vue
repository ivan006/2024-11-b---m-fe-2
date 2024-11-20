<template>
  <div>
    <q-select
        ref="selectRef"
        :modelValue="modelValueComp"
        @update:modelValue="updateValue"
        :options="itemsComp"
        option-label="label"
        :option-value="model.primaryKey"
        :emit-value="true"
        :map-options="true"
        :label="compLabel"
        :disable="disabledComp"
        :loading="compLoading"
        :readonly="readonly"
        :dense="density === 'compact'"
        filled
        :menu-props="{ offsetY: true }"
        :rules="rules"
        :error="!!errorMessage"
        :errorMessage="errorMessage"
        :hideBottomSpace="hideBottomSpace"
    >
      <template v-slot:option="scope">
        <q-item v-if="scope.index === 0" class="q-mt-none q-px-md">
          <q-item-section>
            <div class="q-mb-md">
              <slot />
            </div>
            <q-input
                v-model="search"
                :error="false"
                :error-message="''"
                label="Search"
                dense
                outlined
                single-line
                hide-bottom-space
                class="q-mt-none q-pa-none"
            ></q-input>
          </q-item-section>
        </q-item>
        <q-item v-else-if="scope.index === itemsComp.length - 1" class="text-center q-pa-md">
          <q-pagination
              :modelValue="page"
              :max="maxPages"
              @update:modelValue="pageUpdate"
              input
          />

          <!--@update:modelValue="fetchData"-->
          <!--v-model="pagination.page"-->
          <!--:max="totalPages"-->
        </q-item>
        <q-item v-else v-bind="scope.itemProps" :key="scope.index" :label="scope.opt.label" :value="scope.opt.id">
          <q-item-section>
            <div>
              <!--<q-chip >-->
              <!--  {{scope.opt.id}}-->
              <!--</q-chip> -->
              {{ scope.opt.label }}
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

  </div>
</template>

<script>

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

import QuickListsHelpers from "./QuickListsHelpers";

export default {
  name: "SuperSelect",
  props: {
    hideBottomSpace: {
      type: Boolean,
      default() {
        return false;
      },
    },
    errorMessage: {
      type: String,
      default() {
        return null;
      },
    },
    hideLabel: {
      type: Boolean,
      default() {
        return false;
      },
    },
    maxPages: {
      type: [Number, Object],
      default: 1,
    },
    page: {
      type: [Number, Object],
      default: 1,
    },
    modelValue: {
      type: [Number, Object, String],
      default: null,
    },
    // filters: {
    //   type: String,
    //   default: "{}",
    // },
    model: {
      type: [Object, Function],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelField: {
      type: Object,
      default: () => ({}),
    },
    displayMapField: {
      type: Boolean,
      default: false,
    },
    excludedCols: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "outlined",
    },
    density: {
      type: String,
      default: "compact",
    },
    allowAll: {
      type: Boolean,
      default: false,
    },

    rules: {
      type: Array,
      default: () => ([() => true]),
    },
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    activated: {
      type: Boolean,
      default() {
        return false;
      },
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      timeout: null,
      search: "",
      // pagination: {
      //   page: 1,
      //   limit: 5,
      // },
      totalPages: 1,
      preSelectedItem: null,
      loadingInner: false,
      // fetchedItems: [],
    };
  },
  computed: {
    compLabel() {
      if (this.hideLabel){
        return void 0
      } else {
        return this.modelField.label
      }

      // return void 0
    },
    compLoading() {
      return this.loadingInner || this.loading;
    },
    disabledComp() {
      return this.disabled || this.readonly;
    },
    quickListsIsMobile() {
      return QuickListsHelpers.quickListsIsMobile();
    },
    // title() {
    //   return this.headers.find((header) => header.field !== "id");
    // },
    headers() {
      return QuickListsHelpers.SupaerTableHeaders(
          this.model,
          this.excludedCols,
          false,
          this.displayMapField
      );
    },
    modelValueComp() {
      const foundItem = this.itemsComp.find(item => item.id === this.modelValue);
      return foundItem ? this.modelValue : null;
    },
    itemsComp() {
      let result = [];
      if (!this.disabled) {
        result.push({ label: "", id: null });  // None item for search input
        if (this.allowAll) {
          result.push({ label: "All", id: null });
        }

        if (!this.activated){
          result = result.filter(option => option.id !== this.modelValue);
          let preSelectedItemLabel = ""
          if (this.preSelectedItem){
            preSelectedItemLabel = this.preSelectedItem[this.model.titleKey]
          }
          if (this.modelValue){
            result.push({ label: preSelectedItemLabel, id: this.modelValue });
          }
        }

        for (const item of this.items) {
          result.push({ label: item[this.model.titleKey], id: item[this.model.primaryKey] });
        }
        result.push({ label: "", id: null });  // None item for search input
        // result = [...result, ...this.items.map(item => ({
        //   label: item[this.model.titleKey],
        //   id: item[this.model.primaryKey]
        // }))];
      }
      return result;
    },
    // filtersComp() {
    //   const filters = JSON.parse(this.filters);
    //   if (this.title && this.search) {
    //     filters[this.title.field] = this.search;
    //   }
    //   return filters;
    // },
  },
  methods: {
    hidePopup() {
      this.$refs.selectRef.hidePopup();
    },
    pageUpdate(value) {
      this.$emit('update:page', value);
    },
    updateValue(value) {
      const item = {}
      item[this.model.primaryKey] = value
      this.$emit('update:modelValue', value, item);
    },
    fetchDefaultItem() {
      if (this.modelValue && !this.items.length){

        this.loadingInner = true
        this.model
            .FetchById(
                this.modelValue,
                [],
                {},
                {},
            )
            .then((response) => {
              this.preSelectedItem = response.response.data.data
              this.loadingInner = false
            })
            .catch(() => {
              this.loadingInner = false
            });
      }
    },
  },
  watch: {
    search(value) {
      if (!this.disabled) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.$emit('search', value)
        }, 300)
      }
    },
    modelValue(newVal){
      this.fetchDefaultItem();
    }
  },
  mounted() {
    this.fetchDefaultItem();
  },
};
</script>

<style scoped></style>
