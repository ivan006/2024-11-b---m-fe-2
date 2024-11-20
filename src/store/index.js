import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'

// import { DBCrudCacheSet } from 'wizweb-fe';

import User from 'src/models/User'
import Session from 'src/models/Session'
import RouteLineage  from "src/models/RouteLineage";
import EmailMessage from "src/models/orm-api/EmailMessage";

// Initialize the database
const database = new VuexORM.Database()

// Register models
// database.register(DBCrudCacheSet);

database.register(User)
database.register(Session)
database.register(RouteLineage)
database.register(EmailMessage);


// Create Vuex store
const store = createStore({
  plugins: [VuexORM.install(database)]
})

export default store
