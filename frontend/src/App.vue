<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header-gradient text-white">
      <q-toolbar class="q-pa-md navbar-toolbar">
        <q-toolbar-title>
          <span class="row items-center q-gutter-sm">
            <q-icon name="task" size="md" />
            <span class="app-title">Task Manager</span>
          </span>
        </q-toolbar-title>
        <q-space />
        <div v-if="token" class="row q-gutter-md items-center navbar-content">
          <q-tabs class="text-white tabs-container">
            <q-route-tab
              name="tasks"
              label="Tasks"
              icon="task_alt"
              to="/tasks"
              exact
              class="tab-modern tab-label"
            />
            <q-route-tab
              name="archived"
              label="Archived"
              icon="inventory_2"
              to="/archived"
              exact
              class="tab-modern tab-label"
            />
          </q-tabs>
          <q-separator
            vertical
            class="q-mx-md separator-visible"
            color="white"
          />
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
            class="btn-modern q-pa-md transition-all btn-logout"
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

.navbar-toolbar {
  padding: clamp(12px, 3vw, 16px) !important;
}

.app-title {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: bold;
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

/* Responsive navbar */
@media (max-width: 768px) {
  .navbar-content {
    gap: clamp(8px, 2vw, 16px) !important;
  }

  .tabs-container :deep(.q-tab) {
    padding: 8px 4px !important;
    min-height: 44px;
  }

  .tab-label :deep(.q-tab__label) {
    display: none;
  }

  .tab-label :deep(.q-tab__icon) {
    margin-right: 0;
  }

  .separator-visible {
    display: none;
  }

  .btn-logout :deep(.q-btn__content) {
    flex-direction: column;
  }

  .btn-logout :deep(.q-icon) {
    margin-right: 0 !important;
  }

  .btn-logout :deep(.q-btn__label) {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar-toolbar {
    padding: clamp(8px, 2vw, 12px) !important;
  }

  .app-title {
    display: none;
  }

  .navbar-content {
    gap: 4px !important;
  }

  .tabs-container :deep(.q-tab) {
    padding: 6px 3px !important;
  }
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
