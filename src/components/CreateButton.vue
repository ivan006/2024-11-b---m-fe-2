<template>
  <div>
    <button
        @click="emitCreateItem"
        :disabled="!canEdit"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {{ createButtonText ? createButtonText : 'New' }}

    </button>
  </div>
</template>

<script>
export default {
  name: "CreateButton",
  props: {
    createButtonText: {
      type: String,
      default: "",
    },
    model: {
      type: [Object, Function],
      required: true,
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
    canCreate() {
      let result = false;
      // Add logic here if necessary, e.g., checking permissions
      return result;
    },
    canCreateMsgType() {
      let result = "";
      // Modify to match the logic for different message types
      return result;
    },
    canCreatePart2() {
      let result = this.canCreate;
      // Add logic here if necessary
      return result;
    },
    canEdit() {
      return this.model.rules.creatable();
    },
    canCreateMsg() {
      let result = this.getMsg(this.canCreateMsgType);
      return result;
    },
  },
  methods: {
    emitCreateItem(event) {
      this.$emit('createItem', event);
    },
    getMsg(type) {
      let result = "";
      // Implement logic for different message types
      return result;
    },
  },
  mounted() {
    // Add any necessary logic for mounted lifecycle
  },
};
</script>

<style scoped>
/* Add any custom styles here if necessary */
</style>
