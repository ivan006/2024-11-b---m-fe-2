import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import axios from 'axios';
import VuexORMAxios from '@vuex-orm/plugin-axios';

// Import your models here (e.g., User)
// import User from '@/models/User'; // Adjust path as needed

Vue.use(Vuex);

// Create a new database instance
const database = new VuexORM.Database();

// Register your models to the database
// database.register(User);

// Install the Axios plugin
VuexORM.use(VuexORMAxios, {
    database,
    http: axios.create({
        baseURL: 'https://your-api-base-url.com', // Replace with your API's base URL
    }),
});

// Create the Vuex store with Vuex ORM
export default new Vuex.Store({
    plugins: [VuexORM.install(database)],
});
