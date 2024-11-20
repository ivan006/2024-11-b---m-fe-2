<template>
  <div v-if="!compField?.meta || !compField.meta?.hideField">
    <template v-if="dataPoint.xOrientation">
      <div class="">
        <div class="row" style="align-items: center;">
          <template v-if="!dataPoint.hideLabel">
            <div class="q-pr-sm">
              <div  class="text-bold" style="display: flex; align-items: center;">
                {{ label }}:
              </div>
            </div>
          </template>
          <div>
            <component
                :is="dataPoint.tag ? dataPoint.tag : 'div'"
                :class="dataPoint.class ? dataPoint.class : ''"
                :style="dataPoint.style ? dataPoint.style : ''"
            >
              <!--<template v-if="isRelChildren(compField)">-->
              <!--  <div class="q-pt-sm">-->
              <!--    <template v-if="compRelation">-->
              <!--      <SuperTable-->
              <!--          :parentKeyValuePair="parentKeyValuePair"-->
              <!--          :model="compRelation.field.meta.field.related"-->
              <!--          :canEdit="superOptions.canEdit"-->
              <!--          :defaultViewModeProp="dataPoint.relationViewMode ? dataPoint.relationViewMode : 'table'"-->
              <!--      >-->
              <!--        <template v-if="!!$slots[compRelation.field.name]" #create>-->
              <!--          <slot :name="compRelation.field.name" />-->
              <!--        </template>-->
              <!--      </SuperTable>-->
              <!--    </template>-->
              <!--  </div>-->
              <!--</template>-->
              <template v-if="dataPoint.type === 'component'">
                <component :is="asyncComponent" :item="item" />
              </template>
              <template v-else-if="dataPoint.type === 'function'">
                <!--{{ dataPoint.function(item) }}-->
                <span v-html="dataPoint.function(item)"></span>
              </template>
              <template v-else>
                <DatapointForDisplayInner
                    :header="compField"
                    :item="item"
                    :superOptions="superOptions"
                    hideLabel
                    @editItem="editItem"
                    @deleteItem="deleteItem"
                    :protectImage="protectImage"
                />
              </template>
            </component>
          </div>
        </div>
      </div>
    </template>
    <template v-else>

      <template v-if="!dataPoint.hideLabel && !hideLabel">
        <div  class="text-bold" :style="`visibility: ${label.length ? 'visible' : 'hidden'}`">
          {{ label }}:
        </div>
      </template>

      <component
          :is="dataPoint.tag ? dataPoint.tag : 'div'"
          :class="dataPoint.class ? dataPoint.class : ''"
          :style="dataPoint.style ? dataPoint.style : ''"
      >
        <!--<template v-if="isRelChildren(compField)">-->
        <!--  <div class="q-pt-sm">-->
        <!--    <template v-if="compRelation">-->
        <!--      <SuperTable-->
        <!--          :parentKeyValuePair="parentKeyValuePair"-->
        <!--          :model="compRelation.field.meta.field.related"-->
        <!--          :canEdit="superOptions.canEdit"-->
        <!--          :defaultViewModeProp="dataPoint.relationViewMode ? dataPoint.relationViewMode : 'table'"-->
        <!--      >-->
        <!--        <template v-if="!!$slots[compRelation.field.name]" #create>-->
        <!--          <slot :name="compRelation.field.name" />-->
        <!--        </template>-->
        <!--      </SuperTable>-->
        <!--    </template>-->
        <!--  </div>-->
        <!--</template>-->
        <template v-if="dataPoint.type === 'component'">
          <component
              :is="asyncComponent"
              :item="item"
              :superOptions="superOptions"
              @editItem="editItem"
              @deleteItem="deleteItem"
          />
        </template>
        <template v-else-if="dataPoint.type === 'function'">
          <!--{{ dataPoint.function(item) }}-->
          <span v-html="dataPoint.function(item)"></span>
        </template>
        <template v-else>
          <DatapointForDisplayInner
              :header="compField"
              :item="item"
              :superOptions="superOptions"
              hideLabel
              @editItem="editItem"
              @deleteItem="deleteItem"
              :protectImage="protectImage"
          />
        </template>
      </component>
    </template>
  </div>
</template>

<script>
import DatapointForDisplayInner from './DatapointForDisplayInner.vue'
import { defineAsyncComponent } from 'vue';
import RecordFieldsForDisplayGeneric from "./RecordFieldsForDisplayGeneric.vue";

export default {
  name: 'DatapointForDisplay',
  components: {
    RecordFieldsForDisplayGeneric,
    SuperTable: defineAsyncComponent(() => import('./SuperTable.vue')),
    DatapointForDisplayInner,
  },
  props: {
    header: {
      type: Object,
      default() {
        return null;
      },
    },
    protectImage: {
      type: Boolean,
      default() {
        return false;
      },
    },
    hideLabel: {
      type: Boolean,
      default() {
        return false;
      },
    },
    dataPoint: {
      type: Object,
      default() {
        return {}
      },
    },
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    childRelations: {
      type: Array,
      default() {
        return []
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
  computed: {
    // parentKeyValuePair() {
    //   const pKey = this.compRelation.currentParentRecord.model.primaryKey
    //   const fKey = this.compRelation.currentParentRecord.foreignKeyToParentRecord
    //
    //   const result = {
    //     key: fKey,
    //     value: this.compRelation.currentParentRecord.item[pKey],
    //   }
    //   console.log("result")
    //   console.log(result)
    //   return result
    // },
    asyncComponent() {
      if (this.dataPoint.type === 'component' && this.dataPoint.componentPath) {
        return defineAsyncComponent(this.dataPoint.componentPath);
      }
      return null;
    },
    compField() {
      if (this.header){
        return this.header;
      } else if (this.dataPoint.type === 'component' || this.dataPoint.type === 'function') {
        return { label: this.dataPoint.label };
      } else {
        // const result = this.superOptions.headers.find((header) => {
        const result = this.superOptions.headers.find((header) => {
          return header.field == this.dataPoint.field
        })
        return result
      }
    },
    compRelation() {
      let result = {}
      if (this.compField && this.isRelChildren(this.compField)) {
        result = this.childRelations.find((relation) => {
          return relation.field.name == this.dataPoint.field
        })
      }
      return result
    },
    label() {
      if (typeof this.dataPoint.label !== "undefined") {
        return this.dataPoint.label;
      } else if(this.dataPoint.type === 'component' || this.dataPoint.type === 'function'){
        return "";
      } else {
        return this.compField ? this.compField.label : '';
      }
    }
  },
  methods: {
    deleteItem(e) {
      this.$emit('deleteItem', e)
    },
    editItem(e) {
      this.$emit('editItem', e)
    },
    isRelChildren(header) {
      return header?.usageType && header?.usageType.startsWith('relChildren');
    }
  },
}
</script>

<style scoped></style>
