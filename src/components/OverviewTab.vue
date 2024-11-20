<template>
  <div>
    <template v-if="!item || (item.constructor === Object  && Object.keys(item).length === 0)  ">
      <div class="text-center q-pa-md text-grey-5">None</div>
    </template>
    <template v-else>
      <template v-if="templateOverview && templateOverview.cols">
        <div style="padding-top:0.03px;">
          <div class="row q-col-gutter-xs">
            <RecordFieldsForDisplayCustom
                :item="item"
                :childRelations="childRelations"
                :filteredChildRelations="filteredChildRelations"
                :superOptions="superOptions"
                :template="templateOverview"
                @editItem="editItem"
                @deleteItem="deleteItem"
            >
              <template v-for="(slot, slotName) in $slots" v-slot:[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps"></slot>
              </template>
            </RecordFieldsForDisplayCustom>
          </div>
        </div>
      </template>
      <template v-else>
        <RecordFieldsForDisplayGeneric
            :item="item"
            :superOptions="superOptions"
            @editItem="editItem"
            @deleteItem="deleteItem"
        />
      </template>
    </template>

  </div>
</template>

<script>

import RecordFieldsForDisplayGeneric from "./RecordFieldsForDisplayGeneric.vue";
import RecordFieldsForDisplayCustom from "./RecordFieldsForDisplayCustom.vue";
import DatapointForDisplayInner from "./DatapointForDisplayInner.vue";

export default {
  name: 'OverviewTab',
  components: {DatapointForDisplayInner, RecordFieldsForDisplayCustom, RecordFieldsForDisplayGeneric },
  props: {
    templateOverview: {
      type: Object,
      default() {
        return {};
      },
    },
    filteredChildRelations: {
      type: Array,
      default() {
        return [];
      },
    },
    childRelations: {
      type: Array,
      default() {
        return [];
      },
    },
    item: {
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
  methods: {
    deleteItem(e) {
      this.$emit('deleteItem', e);
    },
    editItem(e) {
      this.$emit('editItem', e);
    },
    clickRow(e) {
      this.$emit('clickRow', e);
    },
  },
};
</script>

<style scoped></style>
