<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Task Manager</q-toolbar-title>
        <div v-if="token">
          <q-btn flat dense label="Logout" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>
    <q-page padding>
      <div v-if="!token">
        <login-form @authed="onAuthed" />
      </div>
      <div v-else>
        <q-card class="q-pa-md q-mb-md">
          <q-form @submit="createTask" class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="newTask.title"
                label="Title"
                :disable="loading"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="newTask.description"
                label="Description"
                :disable="loading"
                type="textarea"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="newTask.status"
                :options="statusOptions"
                label="Status"
                :disable="loading"
              />
            </div>
            <div class="col-12">
              <q-btn
                color="primary"
                label="Add Task"
                type="submit"
                :loading="loading"
              />
            </div>
          </q-form>
          <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
        </q-card>

        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">Your Tasks</div>
            <q-space />
            <q-btn flat icon="refresh" @click="fetchTasks" :disable="loading" />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if="loading" class="row justify-center q-pa-lg">
              <q-spinner size="32px" color="primary" />
            </div>
            <div v-else>
              <q-table :rows="tasks" :columns="columns" row-key="id">
                <template #body-cell-actions="props">
                  <q-td align="right">
                    <q-btn
                      dense
                      color="primary"
                      label="Edit"
                      @click="editTask(props.row)"
                      class="q-mr-sm"
                    />
                    <q-btn
                      dense
                      color="negative"
                      label="Delete"
                      @click="deleteTask(props.row.id)"
                    />
                  </q-td>
                </template>
              </q-table>
            </div>
            <div v-if="listError" class="text-negative q-mt-sm">
              {{ listError }}
            </div>
          </q-card-section>
        </q-card>

        <q-dialog v-model="editDialog">
          <q-card style="min-width: 350px">
            <q-card-section class="text-h6">Edit Task</q-card-section>
            <q-card-section>
              <q-input v-model="editItem.title" label="Title" />
              <q-input
                v-model="editItem.description"
                label="Description"
                type="textarea"
              />
              <q-select
                v-model="editItem.status"
                :options="statusOptions"
                label="Status"
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn color="primary" label="Save" @click="updateTask" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "./api";
import LoginForm from "./components/LoginForm.vue";

const token = ref(localStorage.getItem("token"));
const tasks = ref([]);
const loading = ref(false);
const error = ref("");
const listError = ref("");
const newTask = ref({ title: "", description: "", status: "todo" });
const editDialog = ref(false);
const editItem = ref({ id: null, title: "", description: "", status: "todo" });
const statusOptions = ["todo", "in_progress", "done"];

const columns = [
  { name: "title", label: "Title", field: "title" },
  { name: "description", label: "Description", field: "description" },
  { name: "status", label: "Status", field: "status" },
  { name: "actions", label: "Actions", field: "actions" },
];

function onAuthed(t) {
  localStorage.setItem("token", t);
  token.value = t;
  fetchTasks();
}

function logout() {
  localStorage.removeItem("token");
  token.value = null;
  tasks.value = [];
}

async function fetchTasks() {
  listError.value = "";
  loading.value = true;
  try {
    const { data } = await api.get("/tasks");
    tasks.value = data;
  } catch (e) {
    listError.value = e?.response?.data?.error || e.message;
  } finally {
    loading.value = false;
  }
}

async function createTask(e) {
  e?.preventDefault?.();
  error.value = "";
  loading.value = true;
  try {
    if (!newTask.value.title) throw new Error("Title is required");
    const { data } = await api.post("/tasks", newTask.value);
    tasks.value.unshift(data);
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
    await api.delete(`/tasks/${id}`);
    tasks.value = tasks.value.filter((t) => t.id !== id);
  } catch (e) {
    listError.value = e?.response?.data?.error || e.message;
  }
}

onMounted(() => {
  if (token.value) fetchTasks();
});
</script>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
