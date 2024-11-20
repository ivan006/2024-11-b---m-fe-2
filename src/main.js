import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import 'preline/dist/preline'; // Import the precompiled version
import VueCookies from 'vue-cookies'; // Import vue-cookies
import router from './router'; // Import the router instance

const app = createApp(App);

// Use vue-cookies
app.use(VueCookies);

// Optional: Set a global default expiration time for cookies (e.g., 7 days)
app.config.globalProperties.$cookies.config('7d');

// Use the router
app.use(router);

app.mount('#app');
