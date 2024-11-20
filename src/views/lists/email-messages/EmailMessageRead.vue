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
import SuperRecord from "@/components/SuperRecord.vue";
import EmailMessage from '@/models/orm-api/EmailMessage'

export default {
    name: 'EmailMessage-read',
    components: { SuperRecord },
    computed: {
        superRecordModel() {
            return EmailMessage
        },
    },
}
</script>

<style scoped></style>