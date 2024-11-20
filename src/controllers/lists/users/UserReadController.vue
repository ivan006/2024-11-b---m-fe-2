<template>
    <div>
      <q-card class="q-mb-md" style="overflow: hidden;">
          <userRead
            :id="+$route.params.rId"
            @initialLoadHappened="initialLoadHappened = true"
          />
      </q-card>

      <div
        v-show="initialLoadHappened"
      >

        <div class="row  q-col-gutter-md">
          <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12">

            <q-card class="" style="overflow: hidden;">
              <SectionComponent
                label="Lorum Ipsum"
                noBorder
              >
                <div class="q-ma-md">
                  ...
                </div>
              </SectionComponent>
            </q-card>

          </div>
        </div>
      </div>
    </div>
</template>

<script>
import userRead from '@/views/lists/users/UserRead.vue'
import User from "@/models/User";
import VueCookies from "vue-cookies";
import SectionComponent from "@/views/SectionComponent.vue";

export default {
    name: 'User-read-controller',
    components: {
      SectionComponent,
        userRead,
    },
  data() {
    return {
      initialLoadHappened: false,
      renderSection1: false,
    }
  },
  computed: {
    session() {
      return VueCookies.get('VITE_AUTH');
    }
  },
}
</script>
