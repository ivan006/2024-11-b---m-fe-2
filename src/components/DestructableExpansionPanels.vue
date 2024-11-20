<template>
  <div>
    <template v-if="destroy">
      <slot></slot>
    </template>
    <template v-else>
      <q-expansion-item>
        <template v-slot:header>
          <div class="text-h6">{{ title }}</div>
        </template>
        <!--<div class="q-pa-md">-->
        <div class="">
          <slot></slot>
        </div>
      </q-expansion-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "DestructableExpansionPanels",
  props: {
    destroy: {
      type: Boolean,
      default() {
        return false;
      },
    },
    title: {
      type: String,
      default() {
        return "";
      },
    },
  },
};
</script>

<style scoped></style>
