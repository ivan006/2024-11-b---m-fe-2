import { createRouter, createWebHistory } from 'vue-router';

// Define your routes
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'), // Lazy-loaded
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/AboutView.vue'),
    },
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
