import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory } from 'vue-router';
import routes from './routes'; // Ensure your `routes` array is defined
import VueCookies from 'vue-cookies';

// Choose the appropriate history mode
const createHistory = process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

// Initialize the router
const router = createRouter({
  history: createHistory(process.env.VUE_ROUTER_BASE || '/'), // Default base path
  scrollBehavior: () => ({ left: 0, top: 0 }), // Reset scroll on route change
  routes, // Route definitions
});

// Add global navigation guards
router.beforeEach((to, from, next) => {
  const sessionItem = VueCookies.get('VITE_AUTH');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false);

  if (requiresAuth && !sessionItem?.user) {
    next({ path: '/login' }); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the next route
  }
});

export default router;
