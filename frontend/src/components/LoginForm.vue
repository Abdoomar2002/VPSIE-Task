<template>
  <q-card class="q-pa-md" style="max-width: 500px; margin: 0 auto">
    <q-tabs v-model="tab" class="q-mb-md" dense>
      <q-tab name="login" label="Login" />
      <q-tab name="signup" label="Sign Up" />
    </q-tabs>
    <q-form @submit="submit">
      <q-input
        v-model="email"
        label="Email"
        type="email"
        class="q-mb-sm"
        :disable="loading"
      />
      <q-input
        v-model="password"
        label="Password"
        type="password"
        class="q-mb-sm"
        :disable="loading"
      />
      <q-btn
        color="primary"
        type="submit"
        :label="tab === 'login' ? 'Login' : 'Sign Up'"
        :loading="loading"
      />
    </q-form>
    <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import api from "../api";

const emit = defineEmits(["authed"]);
const tab = ref("login");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function submit(e) {
  e?.preventDefault?.();
  error.value = "";
  loading.value = true;
  try {
    const path = tab.value === "login" ? "/auth/login" : "/auth/signup";
    const { data } = await api.post(path, {
      email: email.value,
      password: password.value,
    });
    emit("authed", data.token);
  } catch (e2) {
    error.value = e2?.response?.data?.error || e2.message;
  } finally {
    loading.value = false;
  }
}
</script>
