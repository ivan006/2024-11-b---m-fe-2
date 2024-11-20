<template>

    <div>
        <emailMessageList
            :parentKeyValuePair="parentKeyValuePair"
            :fetchFlags="fetchFlags"
        />
    </div>
</template>

<script>
import emailMessageList from '@/views/lists/email-messages/EmailMessageList.vue'

export default {
    name: 'EmailMessage-list-controller',
    components: {
        emailMessageList,
    },

    data() {
        return {
            parentKeyValuePair: {},
            fetchFlags: {}
        }
    },
}
</script>