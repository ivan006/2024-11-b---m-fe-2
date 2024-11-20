<template>

    <div>
        <q-card class="q-mb-md">
            <emailMessageRead :id="id" />
        </q-card>
    </div>
</template>

<script>
import emailMessageRead from 'src/views/lists/email-messages/EmailMessageRead.vue'

export default {
    name: 'EmailMessage-read-controller',
    components: {
        emailMessageRead,
    },

    data() {
        return {
            id: +this.$route.params.rId
        }
    },
}
</script>