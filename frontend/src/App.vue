<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header-gradient text-white">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title>
          <span class="row items-center q-gutter-sm">
            <q-icon name="task" size="md" />
            <span class="text-h5 font-weight-bold">Task Manager</span>
          </span>
        </q-toolbar-title>
        <q-space />
        <div v-if="token" class="row q-gutter-md items-center">
          <q-tabs class="text-white">
            <q-route-tab
              name="tasks"
              label="Tasks"
              icon="task_alt"
              to="/tasks"
              exact
              class="tab-modern"
            />
            <q-route-tab
              name="archived"
              label="Archived"
              icon="inventory_2"
              to="/archived"
              exact
              class="tab-modern"
            />
          </q-tabs>
          <q-separator vertical class="q-mx-md" color="white" />
          <q-btn
            round
            dense
            flat
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            @click="$q.dark.toggle()"
            class="btn-modern transition-all"
            size="md"
          />
          <q-btn
            round
            outline
            label="Logout"
            icon="logout"
            @click="logout"
            class="btn-modern q-pa-md transition-all"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const token = ref(localStorage.getItem("token"));

// Watch for storage changes from other tabs/windows
onMounted(() => {
  window.addEventListener("storage", handleStorageChange);
  // Also trigger a check when the router updates
  router.afterEach(() => {
    token.value = localStorage.getItem("token");
  });
});

function handleStorageChange(e) {
  if (e.key === "token") {
    token.value = e.newValue;
  }
}

function logout() {
  localStorage.removeItem("token");
  token.value = null;
  router.push("/login");
}
</script>

<style scoped>
.header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.tab-modern {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-modern:hover {
  transform: translateY(-2px);
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
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Normalize icon sizes inside modern buttons and tabs */
.btn-modern :deep(.q-icon) {
  font-size: 20px;
}
.tab-modern :deep(.q-tab__icon) {
  font-size: 20px;
}
</style>

<style scoped>
html,
body,
#app {
  height: 100%;
}

.header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.card-modern {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.card-modern:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.input-modern :deep(.q-field__control) {
  border-radius: 12px;
}

.input-modern :deep(.q-field__native),
.input-modern :deep(.q-field__textarea) {
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
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
  transform: scale(1.1);
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

.table-modern :deep(thead tr),
.table-modern :deep(tbody tr) {
  transition: background-color 0.2s;
}

.table-modern :deep(tbody tr:hover) {
  background-color: rgba(102, 126, 234, 0.05);
}

.chip-modern {
  border-radius: 12px;
  font-weight: 600;
}
</style>
