<template>
  <div>
    <q-btn
        @click="emitCreateItem"
        :disable="!canEdit"
        outline
    >
      <!--:disable="!canCreatePart2"-->
      {{ createButtonText ? createButtonText : 'New'}}
      <q-tooltip v-if="canCreateMsg.length" bottom :disable="canCreatePart2">
        <span>{{ canCreateMsg }}</span>
      </q-tooltip>
    </q-btn>

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
      // if (this.superOptions.currentParentRel?.field?.fieldExtras?.relationRules?.creatable) {
      //   result = this.superOptions.currentParentRel.field.fieldExtras.relationRules.creatable(
      //       this.superOptions.user,
      //       this.superOptions.currentParentRel.currentParentRecord.item,
      //   );
      // }
      return result;
    },
    canCreateMsgType() {
      let result = "";
      // if (this.superOptions.currentParentRel?.currentParentRecord) {
      //   if (this.superOptions.currentParentRel?.currentParentRecord.model.name === "DBProviderGroup") {
      //     result = "provider";
      //   } else if (this.superOptions.currentParentRel?.currentParentRecord.model.name === "DBCustomerGroup") {
      //     result = "customer";
      //   }
      // }
      return result;
    },
    canCreatePart2() {
      let result = this.canCreate;
      // if (
      //     this.superOptions.currentParentRel?.currentParentRecord &&
      //     this.superOptions.currentParentRel.currentParentRecord.relationType === "relChildrenChildrenApplicationType"
      // ) {
      //   result = this.canCreate || !!this.customerGroupsAssociatedWithUser.length;
      // }
      return result;
    },
    canEdit() {
      const result = this.model.rules.creatable()
      return result;
    },
    canCreateMsg() {
      let result = this.getMsg(this.canCreateMsgType);
      // if (
      //     this.superOptions.currentParentRel?.currentParentRecord &&
      //     this.superOptions.currentParentRel.currentParentRecord.relationType === "relChildrenChildrenApplicationType"
      // ) {
      //   result = this.getMsg("customer");
      // }
      return result;
    },
  },
  methods: {
    emitCreateItem(event) {
      this.$emit('createItem', event);
    },
    getMsg(type) {
      let result = "";
      // if (Array.isArray(type)) {
      //   if (type.length > 1) {
      //     result = `To create first set your active ${type[0]} group and active ${type[1]} group`;
      //   }
      // } else {
      //   result = `To create first set your active ${type} group`;
      // }
      return result;
    },
  },
  mounted() {
    // Add any necessary logic for mounted lifecycle
  },
};
</script>

<style scoped></style>
