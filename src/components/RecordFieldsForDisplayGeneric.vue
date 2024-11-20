<template>
  <div :style="!unClickable ? 'cursor: pointer' : ''" @click="clickRow(item)" class="q-pa-sm">
    <template v-for="(header, index) in superOptions.headers">
      <div
          :key="header.name"
          v-if="
            header.field !== 'id' && (index < maxFields || header.usageType === 'actions') &&
            !header.usageType.startsWith('relChildren') &&
            (header.usageType !== 'actions' || superOptions.model.rules.editable(item))
          "
          class="q-pa-xs q-mb-sm"
          style="min-height: 1.375rem"
      >
        <template v-if="index < 2">
          <template v-if="superOptions.headers[0].value === 'id'">
            <template v-if="index === 0"></template>
            <template v-else>
              <div>
                <DatapointForDisplayInner
                    :header="header"
                    :item="item"
                    :superOptions="superOptions"
                    @editItem="editItem"
                    @deleteItem="deleteItem"
                />
              </div>
            </template>
          </template>
          <template v-else>
            <template v-if="index === 0">
              <DatapointForDisplayInner
                  :header="header"
                  :item="item"
                  :superOptions="superOptions"
                  @editItem="editItem"
                  @deleteItem="deleteItem"

                  isHeading
              />
            </template>
            <template v-else>
              <div>
                <DatapointForDisplayInner
                    :key="index"
                    :header="header"
                    :item="item"
                    :superOptions="superOptions"
                    @editItem="editItem"
                    @deleteItem="deleteItem"
                />
              </div>
            </template>
          </template>
        </template>
        <template v-else>
          <div>
            <DatapointForDisplayInner
                :key="index"
                :header="header"
                :item="item"
                :superOptions="superOptions"
                @editItem="editItem"
                @deleteItem="deleteItem"
            />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import DatapointForDisplayInner from './DatapointForDisplayInner.vue';

export default {
  name: 'RecordFieldsForDisplayGeneric',
  components: { DatapointForDisplayInner },
  props: {
    unClickable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    maxFields: {
      type: Number,
      default() {
        return 999;
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
