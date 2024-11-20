<template>
    <SuperRecord
        :model="superRecordModel"
        :id="+$route.params.rId"
        :displayMapField="true"
        @initialLoadHappened="$emit('initialLoadHappened')"
    >
    </SuperRecord>
</template>

<script>
// import { SuperRecord } from 'wizweb-fe'
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
