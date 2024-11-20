<template>
  <div>

    <SuperRecord
        :model="superRecordModel"
        :id="+$route.params.rId"
        :displayMapField="true"
        @initialLoadHappened="$emit('initialLoadHappened')"
    >
    </SuperRecord>
  </div>
</template>

<script>
import SuperRecord from "@/components/SuperRecord.vue";
import User from '@/models/User'


export default {
    name: 'User-read',
    components: { SuperRecord },
    computed: {
        superRecordModel() {
            return User
        },
    },
}
</script>

<style scoped></style>
