<template>
  <div>
    <SuperTable
      @click.stop
      :showMap="true"
      :model="model"
      :displayMapField="false"
      :parentKeyValuePair="{
        parentFKey: 'recipient_id',
        parentFVal: +item.id,
        parentItem: item,
      }"
      justCreateButton
      createButtonText="Mail"
    />
    <!--:fetchFlags="fetchFlags"-->
  </div>
</template>

<script>
import SuperTable from "@/components/SuperTable.vue";
import EmailMessage from '@/models/orm-api/EmailMessage'
export default {
  name: "EventButtonAttend",
  components: {
    SuperTable,
  },
  data() {
    return {
      model: EmailMessage
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {
      }
    },
    superOptions: {
      type: Object,
      default: () => {
      }
    },
  }
}
</script>

<style scoped>

</style>
