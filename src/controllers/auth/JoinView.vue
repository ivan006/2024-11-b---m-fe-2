<template>
  <div class="container mx-auto px-4 py-6">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-3"></div>
      <div class="col-span-12 md:col-span-6">
        <div class="bg-white p-6 shadow-md rounded-lg">
          <template v-if="!checkEmail">
            <form @submit.prevent="join">
              <h2 class="text-2xl font-semibold mb-4">Register</h2>

              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    v-model="entity.name"
                    type="text"
                    id="name"
                    class="form-input w-full mt-1 p-2 border rounded-md"
                    :class="{'border-red-500': !!errors.name}"
                    :placeholder="'Full Name'"
                />
                <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
              </div>

              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                    v-model="entity.email"
                    type="email"
                    id="email"
                    class="form-input w-full mt-1 p-2 border rounded-md"
                    :class="{'border-red-500': !!errors.email}"
                    :placeholder="'Email'"
                />
                <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
              </div>

              <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="relative">
                  <input
                      v-model="entity.password"
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      class="form-input w-full mt-1 p-2 border rounded-md"
                      :class="{'border-red-500': !!errors.password}"
                      placeholder="Password"
                  />
                  <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    <span v-if="showPassword">Hide</span>
                    <span v-else>Show</span>
                  </button>
                </div>
                <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
              </div>

              <div class="mb-4">
                <label for="c_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div class="relative">
                  <input
                      v-model="entity.c_password"
                      :type="showCPassword ? 'text' : 'password'"
                      id="c_password"
                      class="form-input w-full mt-1 p-2 border rounded-md"
                      :class="{'border-red-500': !!errors.c_password}"
                      placeholder="Confirm Password"
                  />
                  <button
                      type="button"
                      @click="showCPassword = !showCPassword"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    <span v-if="showCPassword">Hide</span>
                    <span v-else>Show</span>
                  </button>
                </div>
                <p v-if="errors.c_password" class="text-sm text-red-500">{{ errors.c_password }}</p>
              </div>

              <button
                  type="submit"
                  :disabled="loading"
                  class="w-full py-2 px-4 mt-4 bg-blue-500 text-white rounded-lg"
              >
                <span v-if="loading">Registering...</span>
                <span v-else>Register</span>
              </button>

              <div class="mt-4 text-center">
                <button
                    @click="$router.push({ path: 'login' })"
                    class="w-full py-2 px-4 mt-4 border border-blue-500 text-blue-500 rounded-lg"
                >
                  Login
                </button>
              </div>
            </form>
          </template>

          <template v-else>
            <p>Your account has been registered!</p>
            <p>We have sent you an email with instructions to verify your email address.</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/models/User";
import VueCookies from "vue-cookies";

export default {
  name: "JoinView",
  data() {
    return {
      entity: {},
      loading: false,
      checkEmail: false,
      showPassword: false,
      showCPassword: false,
      errors: {},
      itemEmpty: {
        name: "",
        email: "",
        password: "",
        c_password: "",
      },
    };
  },
  methods: {
    setErrors(rawErrors = {}) {
      for (const fieldKey in this.itemEmpty) {
        if (rawErrors[fieldKey]) {
          this.errors[fieldKey] = rawErrors[fieldKey][0];
        } else {
          this.errors[fieldKey] = null;
        }
      }
    },
    join() {

      this.loading = true;

      const session = VueCookies.get('VITE_AUTH');

      User.Register(this.entity)
          .then((response) => {
            const user = response.response.data.user;
            this.checkEmail = true;
            this.loading = false;
          })
          .catch((errors) => {
            if (errors.response && errors.response.data.errors) {
              this.setErrors(errors.response.data.errors);
            }
            this.loading = false;
          });
    },
  },
  mounted() {
    this.setErrors();
  },
};
</script>

<style scoped>
/* Tailwind CSS already includes utility classes, so no need for additional styles */
</style>
