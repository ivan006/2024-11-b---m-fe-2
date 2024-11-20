<template>
  <!-- Link Item -->
  <div
      :class="[
      'flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer',
      props.indent ? 'pl-6' : '',
      isActive ? 'bg-gray-200 font-bold' : ''
    ]"
      :tag="props.external ? 'a' : 'div'"
      :href="props.external || undefined"
      @click="click"
      target="_blank"
  >
    <!-- Icon Section -->
    <div v-if="props.icon" class="flex-shrink-0 h-5 w-5 text-gray-500 mr-2">
      <i :class="`fas fa-${props.icon}`"></i>
    </div>

    <!-- Text Section -->
    <div>
      <span>{{ props.title }}</span>
      <p v-if="props.caption" class="text-sm text-gray-500">{{ props.caption }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

defineOptions({
  name: 'EssentialLink'
});

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  route: {
    type: String,
    default: null,
  },
  function: {
    type: Function,
    default: () => {},
  },
  external: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: '',
  },
  activeRoute: {
    type: String,
    required: true,
  },
  indent: {
    type: Boolean,
    default: false,
  },
});

const isActive = computed(() => {
  return props.route && props.route === props.activeRoute;
});

const click = () => {
  if (props.route) {
    router.push({ path: props.route });
  } else {
    props.function();
  }
};
</script>

<style scoped>
/* Add custom styles if necessary */
</style>
