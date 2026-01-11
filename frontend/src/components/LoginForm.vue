<template>
  <div class="login-container">
    <q-card class="card-modern q-pa-lg" style="max-width: 500px">
      <q-tabs
        v-model="tab"
        class="q-mb-lg"
        dense
        align="justify"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="login" label="Login" icon="login" />
        <q-tab name="signup" label="Sign Up" icon="person_add" />
      </q-tabs>
      <q-form @submit="submit" class="q-col-gutter-lg">
        <q-input
          v-model="email"
          label="Email Address"
          type="email"
          prepend-icon="mail"
          outlined
          rounded
          dense
          :disable="loading"
          class="input-modern"
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          prepend-icon="lock"
          outlined
          rounded
          dense
          :disable="loading"
          class="input-modern"
        />
        <q-btn
          color="primary"
          type="submit"
          :label="tab === 'login' ? 'Login' : 'Create Account'"
          :icon="tab === 'login' ? 'login' : 'person_add'"
          :loading="loading"
          round
          size="lg"
          class="btn-modern full-width transition-all"
        />
      </q-form>
      <div v-if="error" class="text-negative q-mt-lg text-center animate-pulse">
        <q-icon name="error" class="q-mr-sm" />
        {{ error }}
      </div>
    </q-card>
  </div>
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

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: clamp(8px, 5vw, 16px);
}

.card-modern {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  width: clamp(300px, 95vw, 500px);
}

.card-modern:hover {
  box-shadow: 0 30px 80px rgba(102, 126, 234, 0.4);
  transform: translateY(-4px);
}

.input-modern :deep(.q-field__control) {
  border-radius: 12px;
}

.input-modern :deep(.q-field__native) {
  border-radius: 12px;
}

.btn-modern {
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
