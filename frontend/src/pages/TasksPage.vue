<template>
  <q-page class="q-pa-lg">
    <!-- Create Task Card -->
    <q-card class="card-modern q-pa-lg q-mb-lg">
      <div class="text-h6 text-weight-bold q-mb-md">Create New Task</div>
      <q-form @submit="createTask" class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <q-input
            v-model="newTask.title"
            label="Title"
            prepend-icon="label"
            outlined
            rounded
            dense
            :disable="loading"
            class="input-modern"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="newTask.description"
            label="Description"
            prepend-icon="notes"
            outlined
            rounded
            :disable="loading"
            type="textarea"
            class="input-modern"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            v-model="newTask.status"
            :options="statusOptions"
            label="Status"
            prepend-icon="flag"
            outlined
            rounded
            dense
            :disable="loading"
            class="input-modern"
          />
        </div>
        <div class="col-12">
          <q-btn
            color="primary"
            label="Add Task"
            icon="add_circle"
            type="submit"
            :loading="loading"
            round
            size="md"
            unelevated
            class="btn-modern full-width transition-all"
          />
        </div>
      </q-form>
      <div v-if="error" class="text-negative q-mt-md animate-pulse">
        {{ error }}
      </div>
    </q-card>

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
            @click="fetchTasks"
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

    <!-- Tasks Table -->
    <q-card class="card-modern">
      <q-card-section class="row items-center q-pa-lg">
        <div class="text-h6 text-weight-bold">Active Tasks</div>
        <q-space />
        <q-btn
          round
          flat
          icon="refresh"
          @click="fetchTasks"
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
          v-else-if="tasks.length === 0"
          class="text-center q-py-lg text-grey"
        >
          <q-icon name="inbox" size="3rem" class="q-mb-md" />
          <div>No tasks yet. Create one to get started!</div>
        </div>
        <div v-else>
          <q-table
            :rows="tasks"
            :columns="columns"
            row-key="id"
            class="table-modern"
            flat
            bordered
          >
            <template #body-cell-actions="props">
              <q-td align="right" class="q-gutter-sm">
                <q-btn
                  round
                  flat
                  color="primary"
                  icon="edit"
                  @click="editTask(props.row)"
                  class="btn-modern transition-all hover-scale"
                  size="md"
                />
                <q-btn
                  round
                  flat
                  color="negative"
                  icon="delete"
                  @click="deleteTask(props.row.id)"
                  class="btn-modern transition-all hover-scale"
                  size="md"
                />
              </q-td>
            </template>
          </q-table>
        </div>
        <div v-if="listError" class="text-negative q-mt-md animate-pulse">
          {{ listError }}
        </div>
      </q-card-section>
    </q-card>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px" class="card-modern">
        <q-card-section class="q-pa-lg">
          <div class="text-h6 text-weight-bold">Edit Task</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-lg q-col-gutter-md">
          <q-input
            v-model="editItem.title"
            label="Title"
            prepend-icon="label"
            outlined
            rounded
            dense
            class="input-modern"
          />
          <q-input
            v-model="editItem.description"
            label="Description"
            prepend-icon="notes"
            outlined
            rounded
            type="textarea"
            class="input-modern q-mt-md"
          />
          <q-select
            v-model="editItem.status"
            :options="statusOptions"
            prepend-icon="flag"
            label="Status"
            outlined
            rounded
            dense
            class="input-modern q-mt-md"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-lg q-gutter-md">
          <q-btn
            round
            outline
            icon="close"
            @click="editDialog = false"
            class="btn-modern transition-all"
          />
          <q-btn
            round
            color="primary"
            icon="save"
            @click="updateTask"
            class="btn-modern transition-all"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api";

const tasks = ref([]);
const loading = ref(false);
const error = ref("");
const listError = ref("");
const searchTerm = ref("");
const statusFilter = ref("all");
const newTask = ref({ title: "", description: "", status: "todo" });
const editDialog = ref(false);
const editItem = ref({ id: null, title: "", description: "", status: "todo" });
const statusOptions = ["todo", "in_progress", "done"];
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

async function fetchTasks() {
  listError.value = "";
  loading.value = true;
  try {
    const params = {};
    const q = searchTerm.value?.trim();
    if (q) params.q = q;
    if (statusFilter.value && statusFilter.value !== "all") {
      params.status = statusFilter.value;
    }
    const { data } = await api.get("/tasks", { params });
    tasks.value = data;
  } catch (e) {
    listError.value = e?.response?.data?.error || e.message;
  } finally {
    loading.value = false;
  }
}

function clearFilters() {
  searchTerm.value = "";
  statusFilter.value = "all";
  fetchTasks();
}

async function createTask(e) {
  e?.preventDefault?.();
  error.value = "";
  loading.value = true;
  try {
    if (!newTask.value.title) throw new Error("Title is required");
    await api.post("/tasks", newTask.value);
    await fetchTasks();
    newTask.value = { title: "", description: "", status: "todo" };
  } catch (e2) {
    error.value = e2?.response?.data?.error || e2.message;
  } finally {
    loading.value = false;
  }
}

function editTask(row) {
  editItem.value = { ...row };
  editDialog.value = true;
}

async function updateTask() {
  try {
    const { id, title, description, status } = editItem.value;
    const { data } = await api.put(`/tasks/${id}`, {
      title,
      description,
      status,
    });
    const idx = tasks.value.findIndex((t) => t.id === id);
    if (idx >= 0) tasks.value[idx] = data;
    editDialog.value = false;
  } catch (e) {
    listError.value = e?.response?.data?.error || e.message;
  }
}

async function deleteTask(id) {
  try {
    const { data } = await api.delete(`/tasks/${id}`);
    tasks.value = tasks.value.filter((t) => t.id !== id);
  } catch (e) {
    listError.value = e?.response?.data?.error || e.message;
  }
}

onMounted(() => {
  fetchTasks();
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

/* Normalize icon sizes inside modern buttons */
.btn-modern :deep(.q-icon) {
  font-size: 20px;
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
</style>
