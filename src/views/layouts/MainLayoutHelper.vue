<template>
  <div>
    <!-- Responsive Header -->
    <template v-if="isSmallScreen">
      <header class="bg-primary text-white py-2 shadow-md">
        <div class="flex items-center justify-between px-4">
          <!-- Logo -->
          <div class="flex items-center space-x-4">
            <div class="h-10 w-10 bg-white rounded-full flex items-center justify-center text-primary">
              <i class="fas fa-school"></i>
            </div>
            <h1 class="text-lg font-semibold">{{ siteTitle }}</h1>
          </div>

          <!-- Menu Button -->
          <button
              @click="toggleLeftDrawer"
              class="text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </header>

      <!-- Drawer Menu -->
      <div
          v-if="leftDrawerOpen"
          class="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-end"
      >
        <div class="w-64 bg-white h-full shadow-lg">
          <div class="p-4 border-b">
            <button
                @click="toggleLeftDrawer"
                class="text-gray-500 hover:text-gray-800"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-4">
            <slot name="menu"></slot>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="p-4 bg-gray-100 min-h-screen">
        <slot name="default"></slot>
      </main>
    </template>

    <!-- Desktop Layout -->
    <template v-else>
      <header class="bg-primary text-white py-4 shadow-md">
        <div class="container mx-auto flex items-center justify-between px-4">
          <!-- Logo -->
          <div class="flex items-center space-x-4">
            <div class="h-10 w-10 bg-white rounded-full flex items-center justify-center text-primary">
              <i class="fas fa-school"></i>
            </div>
            <h1 class="text-lg font-semibold">{{ siteTitle }}</h1>
          </div>

          <!-- Menu -->
          <div class="space-x-4">
            <slot name="menu"></slot>
          </div>
        </div>
      </header>

      <div class="container mx-auto flex mt-4">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-100 p-4 shadow-md">
          <slot name="menu"></slot>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 bg-gray-50 p-4 min-h-screen">
          <slot name="default"></slot>
        </main>
      </div>
    </template>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from "vue";

const isSmallScreen = ref(false);

const checkScreenWidth = () => {
  isSmallScreen.value = window.innerWidth <= 1151;
};

const leftDrawerOpen = ref(false);
const siteTitle = ref("Lorum Ipsum");

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  checkScreenWidth();
  window.addEventListener("resize", checkScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenWidth);
});
</script>

<style>
/* Tailwind Utilities for colors */
.bg-primary {
  background-color: #0d6efd; /* Adjust for your primary color */
}

.text-primary {
  color: #0d6efd; /* Adjust for your primary color */
}
</style>
