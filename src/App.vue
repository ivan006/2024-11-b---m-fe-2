<template>
  <div id="app">
    <nav class="bg-gray-800 text-white p-4">
      <!-- Navigation Links -->
      <router-link to="/" class="mx-2">Home</router-link>
      <router-link to="/about" class="mx-2">About</router-link>
    </nav>

    <!-- Route-Specific Components Rendered Here -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
