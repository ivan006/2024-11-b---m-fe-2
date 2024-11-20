<template>
  <div>
    <!-- Initial Text Area Input -->
    <q-input
        label="Select Date Range"
        readonly
        @click="click"
        v-model="formattedValue"
        :error="false"
        :error-message="''"
        dense
        filled
        :disable="disabled"
        v-slot:append
    >
      <q-icon name="calendar_today" @click="click" />
    </q-input>

    <!-- The Main Modal -->
    <q-dialog v-model="showDialog" max-width="500px">
      <q-card class="q-pa-md">
        <div class="q-mb-md">Select Date & Time</div>

        <!-- Date -->
        <q-input
            label="Date"
            v-model="formattedDate"
            :error="false"
            :error-message="''"
            readonly
            @click="showDatePicker = true"
            dense
            filled
        ></q-input>

        <!-- Date Picker Modal -->
        <q-dialog v-model="showDatePicker" max-width="290px">
          <q-card>
            <q-date
                v-model="selectedDate"
                @update:modelValue="setDefaultStartTime"
            />
            <div class="q-pa-md text-right">
              <q-btn color="primary" @click="showDatePicker = false">OK</q-btn>
            </div>
          </q-card>
        </q-dialog>

        <!-- Time -->
        <q-input
            label="Time"
            v-model="formattedTime"
            :error="false"
            :error-message="''"
            readonly
            @click="showTimePicker = true"
            dense
            filled
        ></q-input>

        <!-- Time Picker Modal -->
        <q-dialog v-model="showTimePicker" max-width="290px">
          <q-card>
            <q-time v-model="selectedTime"></q-time>
            <div class="q-pa-md text-right">
              <q-btn color="primary" @click="showTimePicker = false">OK</q-btn>
            </div>
          </q-card>
        </q-dialog>

        <!-- OK Button -->
        <q-card-actions>
          <q-space></q-space>
          <q-btn color="primary" @click="finalizeDateTime">OK</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { QIcon, QInput } from "quasar";

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "DateAndTimePicker",
  props: {
    hideLabel: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    useTimezone: {
      type: Boolean,
      default: false, // Default to false for local time
    },
  },
  data() {
    return {
      showDialog: false,
      showDatePicker: false,
      showTimePicker: false,
      selectedDate: null,
      selectedTime: null,
      selectedTimezone: "Africa/Johannesburg", // Default timezone
    };
  },
  computed: {
    formattedValue() {
      if (this.formattedDate && this.formattedTime) {
        return `${this.formattedDate} ${this.formattedTime}${
            this.useTimezone ? ` (${this.selectedTimezone})` : ""
        }`;
      }
      return "";
    },
    formattedDate() {
      return this.selectedDate
          ? this.useTimezone
              ? dayjs
                  .tz(this.selectedDate, this.selectedTimezone)
                  .format("dddd, MMMM D, YYYY")
              : dayjs(this.selectedDate).format("dddd, MMMM D, YYYY")
          : "";
    },
    formattedTime() {
      return this.selectedTime
          ? this.useTimezone
              ? dayjs
                  .tz(
                      `${this.selectedDate} ${this.selectedTime}`,
                      this.selectedTimezone,
                  )
                  .format("h:mm A")
              : dayjs(`${this.selectedDate} ${this.selectedTime}`).format("h:mm A")
          : "";
    },
  },
  methods: {
    click() {
      if (!this.disabled) {
        this.showDialog = true;
      }
    },
    setDefaultStartTime() {
      const now = this.useTimezone
          ? dayjs().tz(this.selectedTimezone)
          : dayjs();

      // Set minutes, seconds, and milliseconds to 0 and add 1 hour
      now.minute(0).second(0).millisecond(0).add(1, "hour");

      this.selectedTime = now.format("HH:mm:ss");
    },
    parseTimestamptz(value) {
      if (value) {
        const dateTime = this.useTimezone
            ? dayjs.tz(value, this.selectedTimezone)
            : dayjs(value);

        this.selectedDate = dateTime.format("YYYY-MM-DD");
        this.selectedTime = dateTime.format("HH:mm:ss");
      }
    },
    getTimestampForDatabase() {
      return this.useTimezone
          ? dayjs
              .tz(
                  `${this.selectedDate} ${this.selectedTime}`,
                  this.selectedTimezone,
              )
              .toISOString()
          : dayjs(`${this.selectedDate} ${this.selectedTime}`).format(
              "YYYY-MM-DDTHH:mm:ss.SSS",
          );
    },
    finalizeDateTime() {
      const dateTimeForDB = this.getTimestampForDatabase();
      this.$emit("update:modelValue", dateTimeForDB);
      this.showDialog = false;
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal) {
        this.parseTimestamptz(newVal);
      },
    },
  },
};
</script>


<style scoped></style>
