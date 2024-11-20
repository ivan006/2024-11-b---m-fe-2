<template>
  <div>
    <template v-if="shouldWeShowTopBar()">
      <div :class="noBorder ? 'q-mx-md' : ''">
        <DestructableExpansionPanels
            :destroy="!quickListsIsMobile"
            title="Settings"
        >
          <div class="row items-center wrap">
            <div
                v-if="
                canCreateComputed &&
                canEdit &&
                !hideCreate &&
                !isForSelectingRelation
              "
                style="margin-bottom: 20px"
                class="q-mr-sm"
            >
              <template v-if="!!$slots.create">
                <slot name="create" />
              </template>
              <template v-else>
                <CreateButton
                    v-if="superOptions.model.rules.creatable()"
                    :modelFields="superOptions.modelFields"
                    @createItem="createItem"
                    :model="superOptions.model"
                    :superOptions="superOptions"
                    :template="templateForm"
                    :createButtonText="createButtonText"
                />
              </template>
            </div>
            <template v-if="viewAs.show.length">
              <div class="q-mr-sm">
                <!--<q-select-->
                <!--    style="width: 200px"-->
                <!--    :options="tabOptions"-->
                <!--    v-model="activeTab"-->
                <!--    label="View As"-->
                <!--    option-label="label"-->
                <!--    option-value="value"-->
                <!--    emit-value-->
                <!--    map-options-->
                <!--    dense-->
                <!--    class="col-grow "-->
                <!--    filled-->
                <!--    :rules="[() => true]"-->
                <!--/>-->

                <q-btn-toggle
                    v-model="activeTabRef"
                    toggle-color="primary"
                    :options="tabOptions"
                    style="margin-bottom: 20px"
                    unelevated
                    text-color="grey-8"
                    color="grey-3"
                />

                <!--<q-btn-toggle-->
                <!--    v-if="activeTab === 'calendar'"-->
                <!--    class="q-ml-sm"-->
                <!--    v-model="calendarMode"-->
                <!--    toggle-color="primary"-->
                <!--    :options="[-->
                <!--      {label: 'Timeline', value: 'Timeline'},-->
                <!--      {label: 'List', value: 'List'},-->
                <!--    ]"-->
                <!--    unelevated-->
                <!--    text-color="grey-8"-->
                <!--    color="grey-3"-->
                <!--    style="margin-bottom: 20px;"-->
                <!--/>-->
              </div>
            </template>
            <template
                v-for="filterInput of filterInputs"
                :key="filterInput.name"
            >
              <!--<pre>{{modelValueRef[filterInput.name]}}</pre>-->
              <!--<pre>{{allowedFilters}}</pre>-->
              <!--{{filterInput.name}} {{ modelValue[filterInput.name] !== 'undefined'}}-->
              <template
                  v-if="
                  typeof modelValueRef[filterInput.name] !== 'undefined' &&
                  (allowedFilters == null ||
                    allowedFilters.includes(filterInput.name))
                "
              >
                <template
                    v-if="filterInput.usageType.startsWith('relForeignKey')"
                >
                  <div style="min-width: 200px">
                    <SuperTable
                        :isForSelectingRelation="true"
                        :canEdit="false"
                        v-model="modelValueRef[filterInput.name]"
                        :model="filterInput.meta.field.parent"
                        :rules="[() => true]"
                        :modelField="filterInput"
                        class="q-mr-sm"
                    />
                    <!--v-model="modelValueRef[filterInput.name].value"-->
                  </div>
                </template>
                <template v-if="filterInput.usageType == 'timeRangeStart'">
                  <FilterTime
                      :key="filterInput.name"
                      :modelField="filterInput"
                      v-model="modelValueRef[filterInput.name].value"
                      class="q-mr-sm col-grow"
                      style="max-width: 200px"
                  />
                </template>
              </template>
            </template>
            <q-input
                v-if="
                this.superOptions.model.titleKey !==
                this.superOptions.model.primaryKey
              "
                v-model="searchRef"
                :error="false"
                :error-message="''"
                label="Search"
                dense
                filled
            ></q-input>
          </div>
        </DestructableExpansionPanels>
      </div>
    </template>
  </div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import {defineAsyncComponent} from "vue";
import QuickListsHelpers from "./QuickListsHelpers";
import DestructableExpansionPanels from "./DestructableExpansionPanels.vue";
import CreateButton from "./CreateButton.vue";

const AsyncComponentSuperTable = defineAsyncComponent(
    () => import("./SuperTable.vue"),
);

export default {
  name: "SuperTableTopBar",
  components: {
    CreateButton,
    DestructableExpansionPanels,
    SuperTable: AsyncComponentSuperTable,
  },
  props: {
    templateForm: {
      type: Object,
      default: () => ({}), // Updated default to a function
    },
    createButtonText: {
      type: String,
      default: "", // This is fine as it is (string default doesn't require a function)
    },
    allowedFilters: {
      type: Array,
      default: () => [], // Updated to use a function returning an empty array
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => ({}), // Updated to return an empty object from a function
    },
    downloadables: {
      type: Object,
      default: () => ({}), // Updated to return an empty object from a function
    },
    templateListTable: {
      type: Object,
      default: () => ({}), // Updated to return an empty object from a function
    },
    canCreateComputed: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    isForSelectingRelation: {
      type: Boolean,
      default: false,
    },
    hideCreate: {
      type: Boolean,
      default: false,
    },
    startFieldName: {
      type: String,
      default: "",
    },
    activeTab: {
      type: String,
      default: "",
    },
    search: {
      type: String,
      default: "",
    },
    longField: {
      type: Object,
      default: () => ({}), // Updated to return an empty object from a function
    },
    superOptions: {
      type: Object,
      default: () => ({
        headers: [],
        modelFields: [],
        displayMapField: false,
        model: {},
        canEdit: false,
        currentParentRecord: {},
      }), // Updated to return an object from a function
    },
    viewAs: {
      type: Object,
      default: () => ({
        show: ["table", "grid", "map", "calendar"],
        default: "table",
      }), // Updated to return an object from a function
    },
  },

  data() {
    return {
      activeTabRef: "",
      searchRef: "",
      modelValueRef: {},
    };
  },
  computed: {
    flattenedHeaders() {
      let result = [];
      if (this.templateListTable.length) {
        for (const field of this.templateListTable) {
          const validField = this.superOptions.headers.find(
              (header) => header.field === field.field,
          );
          let addableField = {};

          if (typeof validField !== "undefined") {
            addableField = validField;

            if (typeof field.label !== "undefined") {
              addableField.label = field.label;
            }
            addableField.userConfig = field;
          } else {
            let label = "";
            if (typeof field.label !== "undefined" && !field.hideLabel) {
              label = field.label;
            }

            let fieldName = "";
            if (typeof field.field !== "undefined") {
              fieldName = field.field;
            }

            addableField = {
              align: "left",
              dataType: "attr",
              field: fieldName,
              label: label,
              meta: {},
              name: fieldName,
              sortable: fieldName.length ? true : false,
              usageType: "normal",
              userConfig: field,
            };
          }

          result.push(addableField);
        }
      } else {
        for (const header of this.superOptions.headers) {
          result.push(header);
          if (header.headerParentFields) {
            for (const childHeader of header.headerParentFields) {
              result.push({
                // isChildOf: header,
                ...childHeader,
                userConfig: {},
              });
            }
          }
        }
      }

      return result;
    },
    quickListsIsMobile() {
      return QuickListsHelpers.quickListsIsMobile();
    },
    tabOptions() {
      let result = [];
      // let result = [
      //   { label: 'Table', value: 'table' },
      //   { label: 'Grid', value: 'grid' },
      //   { label: 'Map', value: 'map' },
      //   { label: 'Calendar', value: 'calendar' },
      // ]
      if (this.viewAs.show.includes("grid")) {
        result.push({label: "Grid", value: "grid", icon: "grid_view"});
      }
      if (this.viewAs.show.includes("map") && Object.keys(this.longField).length !== 0) {
        result.push({label: "Map", value: "map", icon: "map"});
      }
      if (this.viewAs.show.includes("calendar") && this.startFieldName) {
        result.push({
          label: "Calendar",
          value: "calendar",
          icon: "calendar_today",
        });
      }
      if (this.viewAs.show.includes("table")) {
        result.push({label: "Table", value: "table"});
      }
      return result;
    },
    itemsForExport() {
      const result = [];
      let compItem = {};
      for (const item of this.items) {
        compItem = {};
        for (const header of this.flattenedHeaders) {
          if (header.userConfig && header.userConfig.type === "function") {
            compItem[header.label] = header.userConfig.function(item);
          } else if (header.usageType) {
            if (
                header.usageType === "readOnlyTimestampType" ||
                header.usageType === "timestampType" ||
                header.usageType === "timeRangeStart" ||
                header.usageType === "timeRangeEnd"
            ) {
              compItem[header.label] = this.formatTimestamp(item[header.field]);
            } else if (header.usageType.startsWith("relLookup")) {
              if (item?.[header.field]?.[header.meta.lookupDisplayField]) {
                compItem[header.label] =
                    item?.[header.field]?.[header.meta.lookupDisplayField];
              }
            } else if (
                !header.usageType.startsWith("relChildren") &&
                item[header.field]
            ) {
              compItem[header.label] = this.truncateStr(item[header.field]);
            }
          }
        }
        result.push(compItem);
      }
      return result;
    },
    filterInputs() {
      const data = this.superOptions.modelFields;

      const result = [];
      for (const item of data) {
        if (
            item.usageType.startsWith("relForeignKeyNormal") ||
            item.usageType == "timeRangeStart"
        ) {
          result.push(item);
        } else if (item.usageType == "relForeignKeyMapExtraRelSublocality") {
          const children = data.filter((item) =>
              item.usageType.startsWith("relForeignKeyMapExtraRel"),
          );

          result.push({
            label: "Place",
            name: "Place",
            usageType: "mapFilter",
            dataType: "normal",
            children: children,
          });
        }
      }
      return result;
    },
  },
  methods: {
    toHtmlIdSafeString(str) {
      return str
          .toString() // Ensure it's a string
          .toLowerCase() // Convert to lowercase
          .trim() // Remove whitespace from both ends
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/[^a-z0-9_-]/g, "") // Remove invalid characters
          .replace(/^-+/, ""); // Remove leading hyphens (if any)
    },
    createItem(event) {
      this.$emit("createItem", event);
    },
    formatTimestamp(timestamp) {
      if (timestamp) {
        const timezone = "Africa/Johannesburg"; // replace with desired timezone
        return dayjs.utc(timestamp, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ") // Parse in UTC
            .tz(timezone) // Convert to target timezone
            .format("dddd, MMMM D, YYYY h:mm A"); // Format in target timezone
      }
      return null;
    },
    convertToCsv() {
      // Check if data is not empty
      if (this.itemsForExport.length === 0) {
        return "";
      }

      // Generate header from the keys of the first object in the data array
      const header = Object.keys(this.itemsForExport[0]).join(",");

      // Generate rows from the data
      const rows = this.itemsForExport.map((row) => {
        return Object.values(row)
            .map((value) => `"${value}"`)
            .join(",");
      });

      return [header, ...rows].join("\r\n");
    },
    truncateStr(str) {
      let truncatedStr = "";
      if (str) {
        const maxLength = 40;
        truncatedStr =
            str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
      }
      return truncatedStr;
    },
    defineAsyncComponent,
    downloadCsv() {
      const csvData = this.convertToCsv();
      const blob = new Blob([csvData], {type: "text/csv;charset=utf-8;"});
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${this.downloadables.csv?.title}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // downloadPdf() {
    //   const doc = new jsPDF();
    //
    //   // Extract headers and rows directly without additional formatting
    //   const tableColumn = Object.keys(this.itemsForExport[0]);
    //   const tableRows = this.itemsForExport.map(row => Object.values(row));
    //
    //   // Generate PDF table using autoTable plugin
    //   doc.autoTable({
    //     head: [tableColumn],
    //     body: tableRows
    //   });
    //
    //   // Save the PDF file
    //   doc.save(`${this.downloadables.pdf}.pdf`);
    // },import html2pdf from 'html2pdf.js';

    downloadPdf() {
      const bodyElement = document.querySelector(
          `#pdfBody${this.toHtmlIdSafeString(this.downloadables.pdf?.title)}`,
      );
      const headerElement = document.querySelector(
          `#pdfHeader${this.toHtmlIdSafeString(this.downloadables.pdf?.title)}`,
      );
      const footerElement = document.querySelector(
          `#pdfFooter${this.toHtmlIdSafeString(this.downloadables.pdf?.title)}`,
      );

      QuickListsHelpers.downloadPdf(
          this.downloadables.pdf?.title,
          bodyElement,
          this.downloadables.pdf["margin"] ? this.downloadables.pdf["margin"] : 0,
          footerElement,
          headerElement,
      );
    },

    shouldWeShowTopBar() {
      // let result = true
      let result = false;
      if (
          this.viewAs.show.length ||
          (this.filterInputs.length &&
              (this.allowedFilters == null ||
                  this.filterInputs.some((filterInput) =>
                      this.allowedFilters.includes(filterInput.name),
                  ))) ||
          this.superOptions.model.titleKey !==
          this.superOptions.model.primaryKey ||
          Object.keys(this.downloadables).includes("csv") ||
          Object.keys(this.downloadables).includes("pdf") ||
          (this.canCreateComputed &&
              this.canEdit &&
              !this.hideCreate &&
              !this.isForSelectingRelation)
      ) {
        result = true;
      }
      return result;
    },
  },
  watch: {
    modelValue: {
      handler(newVal, oldVal) {
        // Use stringified comparison for deep change detection
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.modelValueRef = {...newVal};
        }
      },
      deep: true,
    },
    modelValueRef: {
      handler(newVal, oldVal) {
        // Use stringified comparison to prevent unnecessary updates
        // if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.$emit("update:modelValue", this.modelValueRef);
        // }
      },
      deep: true,
    },
    activeTab: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.activeTabRef = newVal;
        }
      },
    },
    activeTabRef: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.$emit("update:activeTab", this.activeTabRef);
        }
      },
    },
    search: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.searchRef = newVal;
        }
      },
    },
    searchRef: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.$emit("update:search", newVal);
        }
      },
    },
  },
  mounted() {
    this.modelValueRef = {...this.modelValue};
    this.activeTabRef = this.activeTab;
    this.searchRef = this.search;
    for (const modelField of this.superOptions.modelFields) {
      if (
          modelField.usageType.startsWith("relForeignKey") ||
          modelField.dataType.startsWith("mapExtraRel")
      ) {
        this.modelValueRef[modelField.name] = null;
      } else if (modelField.usageType == "timeRangeStart") {

        this.modelValueRef[modelField.name] = {
          value: null,
          usageType: "timeRangeStart",
        };
      }
    }
  },
};
</script>
