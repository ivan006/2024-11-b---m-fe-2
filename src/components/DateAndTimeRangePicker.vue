<template>
  <q-page>
    <!-- Initial Text Area Input -->
    <q-input
        label="Select Date Range"
        readonly
        @click="showDialog = true"
        v-model="formattedValue"
        :error="false"
        :error-message="''"
        filled
    >
      <template v-slot:append>
        <q-icon name="event" />
      </template>
    </q-input>

    <!-- The Main Modal -->
    <q-dialog v-model="showDialog" max-width="500px">
      <q-card class="q-pa-md">
        <!-- Start Section -->
        <div>
          <div class="text-h6">Start</div>

          <!-- Start Date -->
          <q-input
              label="Start Date"
              v-model="formattedStartDate"
              :error="false"
              :error-message="''"
              readonly
              @click="showStartDatePicker = true"
              filled
          ></q-input>

          <!-- Start Date Picker Modal -->
          <q-dialog v-model="showStartDatePicker" max-width="290px">
            <q-date
                v-model="startDate"
                @update:modelValue="setDefaultStartTime"
                :error="false"
                :error-message="''"
            ></q-date>
          </q-dialog>

          <!-- Start Time -->
          <q-input
              label="Start Time"
              v-model="formattedStartTime"
              :error="false"
              :error-message="''"
              readonly
              @click="showStartTimePicker = true"
              filled
          ></q-input>

          <!-- Start Time Picker Modal -->
          <q-dialog v-model="showStartTimePicker" max-width="290px">
            <q-time v-model="startTime"></q-time>
          </q-dialog>
        </div>

        <!-- End Section -->
        <div>
          <div class="text-h6">End</div>

          <!-- End Date -->
          <q-input
              label="End Date"
              v-model="formattedEndDate"
              :error="false"
              :error-message="''"
              readonly
              @click="showEndDatePicker = true"
              filled
          ></q-input>

          <!-- End Date Picker Modal -->
          <q-dialog v-model="showEndDatePicker" max-width="290px">
            <q-date v-model="endDate"></q-date>
          </q-dialog>

          <!-- End Time -->
          <q-input
              label="End Time"
              v-model="formattedEndTime"
              :error="false"
              :error-message="''"
              readonly
              @click="showEndTimePicker = true"
              filled
          ></q-input>

          <!-- End Time Picker Modal -->
          <q-dialog v-model="showEndTimePicker" max-width="290px">
            <q-time
                v-model="endTime"
                @update:modelValue="manuallyChangedEndTime"
            ></q-time>
          </q-dialog>
        </div>

        <!-- OK Button -->
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="finalizeDateTimeRange" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "DateRangePicker",
  props: {
    hideLabel: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      showDialog: false,
      showStartDatePicker: false,
      showEndDatePicker: false,
      showStartTimePicker: false,
      showEndTimePicker: false,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      selectedTimezone: "Africa/Johannesburg",
      duration: 120,
    };
  },
  computed: {
    formattedValue() {
      if (
          this.formattedStartDate &&
          this.formattedStartTime &&
          this.formattedEndTime
      ) {
        return this.startDate === this.endDate
            ? `${this.formattedStartDate} \n${this.formattedStartTime} - ${this.formattedEndTime} (${this.selectedTimezone})`
            : `${this.formattedStartDate} ${this.formattedStartTime} -\n${this.formattedEndDate} ${this.formattedEndTime} (${this.selectedTimezone})`;
      }
      return "";
    },
    formattedStartDate() {
      return this.startDate
          ? dayjs(this.startDate)
              .tz(this.selectedTimezone)
              .format("dddd, MMMM D, YYYY")
          : "";
    },
    formattedEndDate() {
      return this.endDate
          ? dayjs(this.endDate)
              .tz(this.selectedTimezone)
              .format("dddd, MMMM D, YYYY")
          : "";
    },
    formattedStartTime() {
      return this.startTime
          ? dayjs(this.startTime, "HH:mm:ss")
              .tz(this.selectedTimezone)
              .format("h:mm A")
          : "";
    },
    formattedEndTime() {
      return this.endTime
          ? dayjs(this.endTime, "HH:mm:ss")
              .tz(this.selectedTimezone)
              .format("h:mm A")
          : "";
    },

    dateTimeRange() {
      if (
          this.formattedStartDate &&
          this.formattedStartTime &&
          this.formattedEndTime
      ) {
        return `${this.formattedStartDate} \n ${this.formattedStartTime} - ${this.formattedEndTime} (Africa/Johannesburg)`;
      }
      return null;
    },
    // pgDateTimeRange() {
    //   const startDateTime = moment(
    //       `${this.startDate} ${this.startTime}`
    //   ).format("YYYY-MM-DD HH:mm:ssZZ");
    //   const endDateTime = moment(`${this.endDate} ${this.endTime}`).format(
    //       "YYYY-MM-DD HH:mm:ssZZ"
    //   );
    //   return `"[${startDateTime},${endDateTime}]"`;
    // },
  },
  methods: {
    parseTstzrange(value) {
      const matches = value.match(/\[(.*?),(.*)\]/);
      if (matches) {
        const startDateTime = dayjs(matches[1]).tz(this.selectedTimezone);
        const endDateTime = dayjs(matches[2]).tz(this.selectedTimezone);

        this.detectDuration(
            startDateTime.format("HH:mm:ss"),
            endDateTime.format("HH:mm:ss"),
        );
        this.startDate = startDateTime.format("YYYY-MM-DD");
        this.startTime = startDateTime.format("HH:mm:ss");

        this.endDate = endDateTime.format("YYYY-MM-DD");
        this.endTime = endDateTime.format("HH:mm:ss");
      }
    },
    setDefaultStartTime() {
      this.showStartDatePicker = false;
      const now = dayjs()
          .tz(this.selectedTimezone)
          .startOf("hour")
          .add(1, "hour");
      this.startTime = now.format("HH:mm:ss");
      this.endDate = this.startDate;
    },
    getTimestampsForDatabase() {
      const startDateTime = dayjs(`${this.startDate} ${this.startTime}`)
          .tz(this.selectedTimezone)
          .toISOString();
      const endDateTime = dayjs(`${this.endDate} ${this.endTime}`)
          .tz(this.selectedTimezone)
          .toISOString();
      return `[${startDateTime}, ${endDateTime}]`;
    },
    finalizeDateTimeRange() {
      const dateTimeRangeForDB = this.getTimestampsForDatabase();
      this.$emit("update:modelValue", dateTimeRangeForDB);
      this.showDialog = false;
    },
    manuallyChangedEndTime(input) {
      this.detectDuration(this.startTime, input);
    },
    detectDuration(startTime, endTime) {
      this.duration = dayjs(endTime, "HH:mm:ss").diff(
          dayjs(startTime, "HH:mm:ss"),
          "minutes",
      );
    },
  },
  watch: {
    startTime(newStartTime) {
      this.endTime = dayjs(newStartTime, "HH:mm:ss")
          .add(this.duration, "minutes")
          .format("HH:mm:ss");
    },
  },
  mounted() {
    this.parseTstzrange(this.modelValue);
  },
};

</script>

<style scoped></style>
