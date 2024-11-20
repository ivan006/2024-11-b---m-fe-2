<template>
  <div>
    <q-input
        @click="click"
        :label="configs.label"
        :modelValue="computedValue"
        :rules="configs.meta.rules"
        :error="false"
        :error-message="''"
        readonly
        :disable="readonly"
        outlined
        dense
    ></q-input>
    <q-dialog v-model="showRelationDialog" max-width="800px">
      <q-card>
        <q-card-section>
          <div class="text-h6">Select Item</div>
        </q-card-section>
        <q-card-section>
          <SuperTable
              :isForSelectingRelation="true"
              :canEdit="false"
              :modelValue="modelValue"
              @update:modelValue="input"
              :model="configs.meta.field.parent"
              :rules="rules"

          ></SuperTable>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { Attribute } from "@vuex-orm/core";

export default {
  name: "RelationComponent",
  components: {
    SuperTable: () => import("./SuperTable.vue"),
  },
  props: {
    hideLabel: {
      type: Boolean,
      default() {
        return false;
      },
    },
    configs: {
      type: Object,
      default: () => ({}),
    },
    lookup: {
      type: Number,
      default: null,
    },
    modelValue: {
      type: Number,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default() {
        return [() => true];
      },
    },
  },
  data() {
    return {
      showRelationDialog: false,
      newlookup: {},
    };
  },
  computed: {
    isNullable() {
      return this.configs.meta.field.parent.fields()[this.foreignKey]
          .isNullable;
    },
    displayNameField() {
      const relatedModelFields = this.configs.meta.field.parent.fields();
      return Object.keys(relatedModelFields).find(
          (fName) => fName !== "id" && relatedModelFields[fName] instanceof Attribute
      );
    },
    computedValue: {
      get() {
        let result = "";

        const entities = this.configs.meta.field.parent
            .query()
            .whereId(+this.modelValue)
            .get();
        if (entities.length) {
          result = entities[0][this.configs.meta.lookupDisplayField];
        }
        return result;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      }
    }
  },
  methods: {
    input(item) {
      this.newlookup = item;
      this.showRelationDialog = false;
      this.$emit("update:modelValue", item.id);
    },
    click() {
      if (!this.readonly) {
        this.showRelationDialog = true;
      }
    },
  },
};
</script>
