import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'



import User from '@/models/User'
import Session from '@/models/Session'
import RouteLineage  from "@/models/RouteLineage";
import EmailMessage from "@/models/orm-api/EmailMessage";
import DBCrudCacheSet from "@/components/DBCrudCacheSet";

// Initialize the database
const database = new VuexORM.Database()

// Register models
database.register(DBCrudCacheSet);

database.register(User)
database.register(Session)
database.register(RouteLineage)
database.register(EmailMessage);


// Create Vuex store
const store = createStore({
  plugins: [VuexORM.install(database)]
})

export default store
