<template>
  <div>
    <template v-if="!items.length">
      <template v-if="loading">
        <div class="text-center py-4">Loading...</div>
      </template>
      <template v-else>
        <div class="text-center py-4 text-gray-500">None</div>
      </template>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <template v-for="item in items" :key="item.name">
          <template v-if="templateListGrid && templateListGrid.cols">
            <div :class="colClasses(templateListGrid.colWidth ? templateListGrid.colWidth : 3)">
              <div class="card mx-auto" style="height: 100%; overflow: hidden;">
                <RecordFieldsForDisplayCustom
                    :item="item"
                    @clickRow="clickRow"
                    :maxFields="6"
                    :childRelations="[]"
                    isSummary
                    :superOptions="superOptions"
                    :template="templateListGrid"
                    @editItem="editItem"
                    @deleteItem="deleteItem"
                    :unClickable="unClickable || !superOptions.model.rules.readable(item)"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="col-span-1 sm:col-span-1 md:col-span-3">
              <div class="card mx-auto" style="height: 100%">
                <RecordFieldsForDisplayGeneric
                    :item="item"
                    @clickRow="clickRow"
                    :maxFields="6"
                    :superOptions="superOptions"
                    @editItem="editItem"
                    @deleteItem="deleteItem"
                    :unClickable="unClickable"
                />
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>



<script>
import RecordFieldsForDisplayGeneric from "./RecordFieldsForDisplayGeneric.vue";
import RecordFieldsForDisplayCustom from "./RecordFieldsForDisplayCustom.vue";

export default {
  name: "SuperTableGrid",
  components: {
    RecordFieldsForDisplayGeneric,
    RecordFieldsForDisplayCustom,
  },
  props: {
    loading: {
      type: Boolean,
      default() {
        return false;
      },
    },
    excludedCols: {
      type: Array,
      default() {
        return [];
      },
    },
    unClickable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    templateListGrid: {
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

      return `grid-cols-${lg} `;
    },
    deleteItem(e) {
      this.$emit("deleteItem", e);
    },
    editItem(e) {
      this.$emit("editItem", e);
    },
    clickRow(e) {
      this.$emit("clickRow", e[this.superOptions.model.primaryKey], e);
    },
  },
};
</script>

<style scoped></style>
