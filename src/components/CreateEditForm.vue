<template>
  <div>
    <div class="bg-white rounded-lg shadow-lg p-4">
      <div class="text-xl font-semibold">
        {{ titlePrefix }}
        {{
          superOptions.model?.entityHumanName
              ? superOptions.model?.entityHumanName
              : "Item"
        }}
      </div>

      <div class="mt-4">
        <form ref="editForm">
          <template v-if="template && template.cols">
            <div class="grid grid-cols-1 gap-4">
              <RecordFieldsForEditCustom
                  :modelValue="itemData"
                  @update:modelValue="updateModelValue"
                  :superOptions="superOptions"
                  @updateSetDefaultEndTime="updateSetDefaultEndTime"
                  :template="template"
                  :formServerErrors="formServerErrors"
                  :itemErrors="itemErrors"
                  @placeSelected="placeSelected"
              />
            </div>
          </template>
          <template v-else>
            <RecordFieldsForEditGeneric
                :modelValue="itemData"
                @update:modelValue="updateModelValue"
                :superOptions="superOptions"
                @updateSetDefaultEndTime="updateSetDefaultEndTime"
                :formServerErrors="formServerErrors"
                :itemErrors="itemErrors"
                @placeSelected="placeSelected"
            />
          </template>
        </form>
      </div>

      <div class="mt-4">
        <div class="text-right text-red-500">
          {{
            Object.keys(itemErrors).length
                ? `${Object.keys(itemErrors)[0]} is required${Object.keys(
                    itemErrors
                ).length > 1
                    ? " (and " + (Object.keys(itemErrors).length - 1) + " more error/s)."
                    : "."} `
                : ""
          }}
        </div>
        <div class="text-right mt-2">
          <button
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md"
              @click="cancel"
          >
            Cancel
          </button>
          <button
              class="ml-2 px-4 py-2 text-white bg-blue-500 rounded-md"
              @click="editItemSubmit"
              :disabled="loading || submitting"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend Day.js with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

import RelationComponent from "./RelationComponent.vue";
import DateAndTimeRangePicker from "./DateAndTimeRangePicker.vue";
import QuickListsHelpers from "./QuickListsHelpers";
import SuperSelect from "./SuperSelect.vue";
import { defineAsyncComponent } from "vue";
import RecordFieldsForEditGeneric from "./RecordFieldsForEditGeneric.vue";
import RecordFieldsForDisplayGeneric from "./RecordFieldsForDisplayGeneric.vue";
import RecordFieldsForDisplayCustom from "./RecordFieldsForDisplayCustom.vue";
import RecordFieldsForEditCustom from "./RecordFieldsForEditCustom.vue";
import CreateButton from "./CreateButton.vue";
import FieldUsageTypes from "./FieldUsageTypes";

const AsyncSuperTableComponent = defineAsyncComponent(
    () => import("./SuperTable.vue"),
);

export default {
  name: "CreateEditForm",
  components: {
    CreateButton,
    RecordFieldsForEditCustom,
    RecordFieldsForDisplayCustom,
    RecordFieldsForDisplayGeneric,
    RecordFieldsForEditGeneric,
    SuperSelect,
    DateAndTimeRangePicker,
    RelationComponent,
    SuperTable: AsyncSuperTableComponent,
  },
  props: {
    template: {
      type: Object,
      default() {
        return {};
      },
    },
    submitting: {
      type: Boolean,
      default() {
        return false;
      },
    },
    titlePrefix: {
      type: String,
      default: () => "",
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    formServerErrors: {
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
      itemData: this.modelValue,
      loading: false,
      itemErrors: {}, // Track individual field errors
    };
  },
  computed: {
    placeFieldsWithFieldNames() {
      let result = [];
      const location_address_place_name = this.superOptions.modelFields.find(
          (field) => field.usageType == "location_address_place_name",
      );

      if (location_address_place_name) {
        for (const placeFieldType of QuickListsHelpers.mapPlaceFields()) {
          const placeField = this.superOptions.modelFields.find(
              (field) => field.usageType == placeFieldType.flag,
          );
          if (placeField) {
            result.push({
              ...placeFieldType,
              fieldNames: placeField.name,
              fieldMore: placeField,
            });
          }
        }
      }
      return result;
    },
  },
  methods: {
    async upsertAndGetEntityIds(googlePlace) {
      // Assume Upsert returns a promise that resolves with the upserted entity.
      let parent_id = null;

      // Mapping of flags to Vuex ORM Models.
      const flagToModel = {
        relForeignKeyMapExtraRelCountry: this.superOptions.modelFields.find(
            (field) => field.usageType == "relForeignKeyMapExtraRelCountry",
        ).meta.relatedModel,
        relForeignKeyMapExtraRelAdminArea1: this.superOptions.modelFields.find(
            (field) => field.usageType == "relForeignKeyMapExtraRelAdminArea1",
        ).meta.relatedModel,
        relForeignKeyMapExtraRelAdminArea2: this.superOptions.modelFields.find(
            (field) => field.usageType == "relForeignKeyMapExtraRelAdminArea2",
        ).meta.relatedModel,
        relForeignKeyMapExtraRelLocality: this.superOptions.modelFields.find(
            (field) => field.usageType == "relForeignKeyMapExtraRelLocality",
        ).meta.relatedModel,
        relForeignKeyMapExtraRelSublocality: this.superOptions.modelFields.find(
            (field) => field.usageType == "relForeignKeyMapExtraRelSublocality",
        ).meta.relatedModel,
        // test: this.model,
      };

      let allValues = [];
      let result = [];
      for (const placeField of QuickListsHelpers.mapPlaceFields()) {
        if (placeField.googleType === "components") {
          let component;
          if (Array.isArray(placeField.googleName)) {
            // Find the first available sublocality level
            for (const name of placeField.googleName) {
              component = googlePlace.address_components.find((item) =>
                  item.types.includes(name),
              );
              if (component) break;
            }
          } else {
            component = googlePlace.address_components.find((item) =>
                item.types.includes(placeField.googleName),
            );
          }

          let finalValue = "";
          if (component) {
            finalValue = component.long_name;
          } else {
            if (placeField.flag === "relForeignKeyMapExtraRelSublocality") {
              // If sublocality is not found, default to the most granular available
              finalValue = allValues["relForeignKeyMapExtraRelLocality"];
            } else if (
                placeField.flag === "relForeignKeyMapExtraRelAdminArea2"
            ) {
              // If administrative_area_level_2 is not found, duplicate it from administrative_area_level_1
              finalValue = allValues["relForeignKeyMapExtraRelAdminArea1"];
            } else if (placeField.flag === "relForeignKeyMapExtraRelLocality") {
              // If locality is not found, set to "Unknown"
              finalValue = "Unknown";
            } else {
              finalValue = null;
            }
          }
          allValues[placeField.flag] = finalValue;

          if (flagToModel[placeField.flag]) {
            // Extract the data for this entity from the example data.
            let data = {
              name: finalValue, // Set the data.
            };
            if (placeField.flag !== "relForeignKeyMapExtraRelCountry") {
              data.parent_id = parent_id; // Set the parent id.
            }

            let currentType = "";
            if (placeField.flag === "relForeignKeyMapExtraRelAdminArea1") {
              currentType = FieldUsageTypes.mapExtraRelCountry();
            } else if (
                placeField.flag === "relForeignKeyMapExtraRelAdminArea2"
            ) {
              currentType = FieldUsageTypes.mapExtraRelAdminArea1();
            } else if (placeField.flag === "relForeignKeyMapExtraRelLocality") {
              currentType = FieldUsageTypes.mapExtraRelAdminArea2();
            } else if (
                placeField.flag === "relForeignKeyMapExtraRelSublocality"
            ) {
              currentType = FieldUsageTypes.mapExtraRelLocality();
            }

            const parentKey = Object.keys(
                flagToModel[placeField.flag].fieldsMetadata,
            ).find(
                (key) =>
                    flagToModel[placeField.flag].fieldsMetadata[key].usageType ===
                    currentType,
            );

            data[parentKey] = parent_id;

            // Perform the Upsert operation.
            // const responce = await flagToModel[
            //     placeField.flag
            //     ].Store(data)

            const responce = await flagToModel[placeField.flag].Store(
                {
                  ...data,
                  // ...this.createPayloadExtras,
                },
                [],
                {
                  upsertCompareOn: "name",
                  upsertCompareMode: "sluggify",
                },
                {},
            );
            // Extract the id from the result for use as parent_id in the next iteration.
            // console.log('responce')
            // console.log(responce.response.data.data)
            parent_id = responce.response.data.data.id;
            result[placeField.flag] = parent_id;
          }
        }
      }
      return result;
    },
    async placeSelected(arg) {
      this.loading = true;

      const entitiesIds = await this.upsertAndGetEntityIds(arg);
      for (const placeField of this.placeFieldsWithFieldNames) {
        if (placeField.googleType === "simple") {
          this.itemData[placeField.fieldNames] = arg[placeField.googleName];
        } else if (placeField.googleType === "mapGeoLoc") {
          if (arg.geometry?.location?.[placeField.googleName]) {
            this.itemData[placeField.fieldNames] =
                arg.geometry.location[placeField.googleName]();
          }
        } else if (placeField.googleType === "components") {
          this.itemData[placeField.fieldNames] = entitiesIds[placeField.flag];
        }
      }
      this.loading = false;
    },
    updateSetDefaultEndTime(arg) {
      const timeRangeEndField = this.superOptions.modelFields.find(
          (field) => field.usageType === "timeRangeEnd",
      );

      this.itemData[timeRangeEndField.name] = dayjs(arg)
          .add(2, "hours")
          .format("YYYY-MM-DDTHH:mm:ss.SSS");
    },
    cancel() {
      this.$emit("cancel");
    },
    updateModelValue(item) {
      this.$emit("update:modelValue", item);
    },
    getRequiredFields() {
      return this.superOptions.modelFields
          .filter((field) => field.meta && field.meta.required)
          .map((field) => field.name);
    },
    validateField(field, value) {
      if (!value) {
        this.itemErrors[field] = "Required";
      } else {
        delete this.itemErrors[field];
      }
    },
    validateForm() {
      this.itemErrors = {}; // Clear previous errors

      // Get required fields from superOptions.modelFields
      const requiredFields = this.getRequiredFields();

      // Validate only the required fields
      requiredFields.forEach((field) => {
        this.validateField(field, this.modelValue[field]);
      });

      return Object.keys(this.itemErrors).length === 0;
    },
    async editItemSubmit() {
      if (this.validateForm()) {
        this.$emit("submit");
      }
    },
  },
};
</script>
<style scoped>
/* Scoped styles for modals, buttons, etc., can go here */
</style>
