<template>
  <span :class="isHeading ? 'text-h6' : ''">
    <template v-if="typeof header.usageType == 'undefined'"></template>
    <template
        v-else-if="
        !isHeading && !hideLabel && !header.usageType.startsWith('relChildren')
      "
    >
      <div class="text-caption">
        {{ header.label }}
      </div>
    </template>

    <template v-if="typeof header.usageType == 'undefined'">
      <!--{{typeof header.usageType}}-->
    </template>
    <template v-else-if="header.usageType.startsWith('relChildren')"></template>
    <template
        v-else-if="
        header.usageType === 'readOnlyTimestampType' ||
        header.usageType === 'timestampType' ||
        header.usageType === 'timeRangeStart' ||
        header.usageType === 'timeRangeEnd'
      "
    >
      {{ formatTimestamp(item[header.field]) }}
    </template>
    <template v-else-if="header.usageType.startsWith('fileImageType')">
      <template v-if="protectImage">
        <q-btn
            @click.stop="showImageModel = true"
            flat
            unelevated
            icon="image"
            color="grey"
        />
        <!--label="Show Image"-->
        <q-dialog v-model="showImageModel">
          <q-card
              style="width: 700px; max-width: calc(-32px + 100vw)"
              flat
              class="bg-grey-2"
          >
            <q-card-section class="q-pa-sm flex flex-center">
              <img
                  alt="&nbsp;File not found."
                  :src="`${item[header.field]}`"
                  style="max-width: 100%"
              />
              <!--<q-img-->
              <!--    alt="File not found."-->
              <!--    :src="`${item[header.field]}`"-->
              <!--    style="width: 100%; height: auto;"-->
              <!--&gt;-->
              <!--  <div v-if="!item[header.field]" class="absolute-full text-subtitle2 flex flex-center">-->
              <!--    Oops, no image found!-->
              <!--  </div>-->
              <!--</q-img>-->
            </q-card-section>
          </q-card>
        </q-dialog>
      </template>
      <template v-else>
        <q-card style="width: unset; max-width: unset" flat class="bg-grey-2">
          <q-card-section class="q-pa-sm">
            <!--<img-->
            <!--    alt="File not found."-->
            <!--    style="max-width:100%;"-->
            <!--/>-->

            <!--:src="`${superOptions.model?.fileUrlPrefix}/${item[header.field]}`"-->
            <q-img alt="File not found." :src="`${item[header.field]}`">
              <!--:ratio="16/5"-->
              <div
                  v-if="!item[header.field]"
                  class="absolute-full text-subtitle2 flex flex-center"
              >
                Oops, no image found!
              </div>
            </q-img>
          </q-card-section>
        </q-card>
      </template>
    </template>
    <template v-else-if="header.usageType.startsWith('htmlField')">
      <div v-html="item[header.field]" />
    </template>
    <template v-else-if="header.usageType == 'actions' && !disabled()">
      <div @click.stop :style="disabled() ? 'cursor: default;' : ''">
        <q-btn
            @click.stop="editItem(item)"
            :disable="disabled()"
            color="grey"
            icon="edit"
            flat
            size="sm"
        />
        <q-btn
            @click.stop="deleteItem(item)"
            :disable="disabled()"
            color="grey"
            icon="delete"
            flat
            size="sm"
        />
      </div>
    </template>
    <template v-else-if="header.usageType.startsWith('relLookup')">
      <div
          style="min-height: 32px; cursor: pointer"
          @click.stop="clickParent(item?.[header.field], header)"
      >
        <q-chip
            class="q-ma-none"
            v-if="item?.[header.field]?.[header.meta.lookupDisplayField]"
        >
          <div
              :title="item?.[header.field]?.[header.meta.lookupDisplayField]"
              style="overflow: hidden"
          >
            {{ item?.[header.field]?.[header.meta.lookupDisplayField] }}
          </div>
        </q-chip>
      </div>
    </template>
    <template v-else>
      <template v-if="isTag">
        <div @click.stop="clickParent(item)" style="cursor: pointer">
          <q-chip v-if="isTag">
            {{ item[header.field] }}
          </q-chip>
        </div>
      </template>
      <template v-else>
        <div :title="item[header.field]" style="overflow: hidden">
          {{ truncateStr(item[header.field]) }}
        </div>
      </template>
    </template>
  </span>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend Day.js with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);

import QuickListsHelpers from "./QuickListsHelpers";

export default {
  name: "DatapointForDisplayInner",
  data() {
    return {
      showImageModel: false,
    };
  },
  props: {
    protectImage: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isTag: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isHeading: {
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
    header: {
      type: Object,
      default() {
        return {};
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
    clickParent(item, header) {
      const model = header.meta.field.parent;
      model.openRecord(item[model.primaryKey], item, this.$router);
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
    disabled() {
      let result = false;

      if (this.superOptions.model.rules?.editable) {
        result = this.superOptions.model.rules.editable(this.item);
      }
      return !result;
    },
    deleteItem(e) {
      this.$emit("deleteItem", e);
    },
    editItem(e) {
      this.$emit("editItem", e);
    },
    formatTimestamp(timestamp) {
      if (timestamp) {
        const timezone = "Africa/Johannesburg"; // Replace with your desired timezone
        const formattedDateInTimeZone = dayjs
            .utc(timestamp, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ") // Parse in UTC
            .tz(timezone) // Convert to target timezone
            .format("dddd, MMMM D, YYYY h:mm A"); // Format as needed
        return formattedDateInTimeZone;
      } else {
        return null;
      }
    },
  },
};

</script>

<style scoped></style>
