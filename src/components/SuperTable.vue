<template>
  <SuperTable
      :columns="columns"
      :items="items"
      :canCreate="true"
      :perPage="5"
      @createItem="createItem"
      @editItem="editItem"
      @deleteItem="deleteItem"
  >
    <template #top-bar>
      <div class="flex justify-between items-center mb-4">
        <input
            v-model="search"
            type="text"
            placeholder="Search items..."
            class="px-4 py-2 border rounded-md w-full md:w-1/3"
        />
        <button
            @click="createItem"
            class="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Item
        </button>
      </div>
    </template>
  </SuperTable>
</template>

<script>
import SuperTable from '@/components/SuperTable.vue';

export default {
  components: {SuperTable},
  data() {
    return {
      search: '',
      columns: [
        {label: 'ID', key: 'id'},
        {label: 'Name', key: 'name'},
        {label: 'Email', key: 'email'},
      ],
      items: [
        {id: 1, name: 'John Doe', email: 'john@example.com'},
        {id: 2, name: 'Jane Doe', email: 'jane@example.com'},
      ],
    };
  },
  methods: {
    createItem() {
      console.log('Create item');
    },
    editItem(item) {
      console.log('Edit item:', item);
    },
    deleteItem(item) {
      console.log('Delete item:', item);
    },
  },
};
</script>
