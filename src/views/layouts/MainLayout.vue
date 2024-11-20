<template>
  <MainLayoutHelper>
    <!-- Menu Slot -->
    <template v-slot:menu>
      <div>
        <template v-for="link in linksList" :key="link.title || link.groupTitle">
          <!-- Group Title -->
          <template v-if="link.groupTitle">
            <div class="text-gray-500 font-semibold uppercase py-2">
              {{ link.groupTitle }}
            </div>
            <!-- Group Links -->
            <EssentialLink
                v-for="sublink in link.links"
                :key="sublink.title"
                v-bind="sublink"
                :active-route="activeRoute"
                :indent="true"
            />
          </template>

          <!-- Individual Link -->
          <template v-else>
            <EssentialLink
                v-bind="link"
                :active-route="activeRoute"
                :indent="false"
            />
          </template>
        </template>
      </div>
    </template>

    <!-- Default Slot -->
    <template v-slot:default>
      <div class="container mx-auto px-4">
        <!-- Breadcrumbs -->
        <div class="mb-4">
          <BreadcrumbsComp />
        </div>
        <!-- Router View -->
        <router-view @route-changed="updateActiveRoute" />
      </div>
    </template>
  </MainLayoutHelper>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import EssentialLink from 'src/views/EssentialLink.vue';
import MainLayoutHelper from 'src/views/layouts/MainLayoutHelper.vue';
import BreadcrumbsComp from 'src/views/BreadcrumbsComp.vue';
import VueCookies from 'vue-cookies';

defineOptions({
  name: 'MainLayout',
});

// Track active route
const route = useRoute();
const activeRoute = ref(route.path);

watch(route, (newRoute) => {
  activeRoute.value = newRoute.path;
});

// Fetch session data from cookies
const session = computed(() => {
  return VueCookies.get('VITE_AUTH');
});

// Generate Links List
const linksList = computed(() => {
  const links = [
    { title: 'Users', route: '/lists/users' },
    { title: 'Email Messages', route: '/lists/email-messages' },
  ];

  if (session.value) {
    const myAccount = `/lists/users/${session.value.user.id}/${session.value.user.name}`;
    links.push(
        { icon: 'person', title: 'My Account', route: myAccount },
        {
          icon: 'logout',
          title: 'Logout',
          function: () => {
            VueCookies.remove('VITE_AUTH');
            window.location.href = '/';
          },
        }
    );
  } else {
    links.push(
        { icon: 'person', title: 'Login', route: '/login' },
        { icon: 'edit', title: 'Register', route: '/register' }
    );
  }

  links.push({ icon: 'info', title: 'About', route: '/about' });

  return links;
});

// Update active route function
function updateActiveRoute(newRoute) {
  activeRoute.value = newRoute;
}
</script>
