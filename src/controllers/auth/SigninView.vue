<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <div class="max-w-md w-full">
      <!-- Card-like container using Tailwind classes -->
      <div class="bg-white shadow-lg rounded-lg p-6">
        <form @submit.prevent="submit">
          <div class="text-2xl font-semibold mb-4">Login</div>

          <!-- Show form if no session -->
          <template v-if="!session">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                  v-model="form.email"
                  id="email"
                  type="email"
                  name="email"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  :rules="[emailRule]"
                  autocomplete="email"
                  required
              />
            </div>

            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input
                  v-model="form.password"
                  id="password"
                  type="password"
                  name="password"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  autocomplete="password"
                  required
              />
            </div>

            <!-- Submit button -->
            <button
                type="submit"
                :disabled="loading"
                class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <span v-if="loading">Loading...</span>
              <span v-else>Login</span>
            </button>

            <!-- Register button -->
            <div class="mt-4 text-center">
              <button
                  type="button"
                  @click="$router.push({ path: 'register' })"
                  class="w-full py-2 px-4 border border-gray-300 rounded-md text-blue-600 hover:text-blue-800"
              >
                Register
              </button>
            </div>
          </template>

          <!-- If session exists, show welcome message -->
          <template v-else>
            <p>Welcome <b>{{ loginSession.user.email }}</b></p>
          </template>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import Session from "@/models/Session";

export default {
  name: "SigninView",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
      emailRule: (val) => !!val || 'Email is required',
    };
  },
  computed: {
    loginSession() {
      return Session.query().withAllRecursive().first();
    },
    session() {
      const session = VueCookies.get('VITE_AUTH');
      return session;
    },
  },
  methods: {
    submit() {
      this.loading = true;
      Session.signIn(this.form)
          .then((response) => {
            const sessionData = response.response.data;
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7); // Set the expiration date to 7 days from now

            sessionData.expireDate = expireDate.toISOString(); // Add the expiration date to the session data

            VueCookies.set('VITE_AUTH', sessionData, '7d');
            this.loading = false;
            window.location.href = '/'; // Redirect to home page after login
          })
          .catch(() => {
            this.loading = false;
          });
    },
  },
};
</script>

<style scoped></style>
