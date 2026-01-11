<template>
  <q-page class="q-pa-lg">
    <!-- Filter Card -->
    <q-card class="card-modern q-pa-lg q-mb-lg">
      <div class="row q-col-gutter-lg items-end">
        <div class="col-12 col-md-6">
          <q-input
            v-model="searchTerm"
            label="Search tasks"
            prepend-icon="search"
            outlined
            rounded
            dense
            clearable
            :disable="loading"
            class="input-modern"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="statusFilter"
            :options="statusFilterOptions"
            label="Status"
            prepend-icon="filter_list"
            outlined
            rounded
            dense
            emit-value
            map-options
            :disable="loading"
            class="input-modern"
          />
        </div>
        <div class="col-12 col-md-3 flex justify-end q-gutter-md">
          <q-btn
            color="primary"
            label="Apply"
            icon="tune"
            @click="fetchArchived"
            :loading="loading"
            round
            size="md"
            unelevated
            class="btn-modern q-pa-md transition-all"
          />
          <q-btn
            outline
            label="Clear"
            icon="close"
            @click="clearFilters"
            :disable="loading"
            round
            size="md"
            class="btn-modern q-pa-md transition-all"
          />
        </div>
      </div>
    </q-card>

    <!-- Archived Tasks Card -->
    <q-card class="card-modern">
      <q-card-section class="row items-center q-pa-lg">
        <div class="text-h6 text-weight-bold">Archived Tasks</div>
        <q-space />
        <q-btn
          round
          flat
          icon="refresh"
          @click="fetchArchived"
          :disable="loading"
          class="btn-modern transition-all hover-scale"
          size="md"
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-lg">
        <div v-if="loading" class="row justify-center q-pa-lg">
          <q-spinner size="40px" color="primary" />
        </div>
        <div
          v-else-if="archived.length === 0"
          class="text-center q-py-lg text-grey"
        >
          <q-icon name="archive" size="3rem" class="q-mb-md" />
          <div>No archived tasks yet.</div>
        </div>
        <div v-else>
          <q-table
            :rows="archived"
            :columns="columns"
            row-key="id"
            class="table-modern"
            flat
            bordered
          >
            <template #body-cell-actions="props">
              <q-td align="center">
                <q-chip
                  icon="inventory_2"
                  label="Archived"
                  color="grey-3"
                  text-color="grey"
                  class="chip-modern"
                />
              </q-td>
            </template>
          </q-table>
        </div>
        <div v-if="error" class="text-negative q-mt-md animate-pulse">
          {{ error }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api";

const archived = ref([]);
const loading = ref(false);
const error = ref("");
const searchTerm = ref("");
const statusFilter = ref("all");
const statusFilterOptions = [
  { label: "All", value: "all" },
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

const columns = [
  { name: "title", label: "Title", field: "title" },
  { name: "description", label: "Description", field: "description" },
  { name: "status", label: "Status", field: "status" },
  { name: "actions", label: "Actions", field: "actions" },
];

async function fetchArchived() {
  error.value = "";
  loading.value = true;
  try {
    const params = {};
    const q = searchTerm.value?.trim();
    if (q) params.q = q;
    if (statusFilter.value && statusFilter.value !== "all") {
      params.status = statusFilter.value;
    }
    const { data } = await api.get("/tasks/archive", { params });
    archived.value = data;
  } catch (e) {
    error.value = e?.response?.data?.error || e.message;
  } finally {
    loading.value = false;
  }
}

function clearFilters() {
  searchTerm.value = "";
  statusFilter.value = "all";
  fetchArchived();
}

onMounted(() => {
  fetchArchived();
});
</script>

<style scoped>
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

/* Normalize icon sizes inside modern buttons */
.btn-modern :deep(.q-icon) {
  font-size: 20px;
}
</style>
