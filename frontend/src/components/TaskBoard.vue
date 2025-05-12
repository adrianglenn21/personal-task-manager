<template>
  <div class="h-full w-full p-4 bg-gray-50">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-indigo-500">
        <svg
          class="animate-spin h-10 w-10 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="mt-4 font-medium">Loading your tasks...</p>
      </div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm"
      role="alert"
    >
      <div class="flex items-center">
        <svg
          class="h-6 w-6 text-red-500 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <p class="font-bold">Something went wrong</p>
          <p>{{ error }}</p>
        </div>
      </div>
      <button
        @click="fetchColumns"
        class="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-md transition-colors"
      >
        Try again
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
      <div v-for="column in columns" :key="column.id" class="flex flex-col h-full">
        <div class="flex justify-between items-center mb-4 px-1">
          <h2 class="text-lg font-bold text-gray-800 flex items-center">
            {{ column.title }}
            <span
              class="ml-2 text-xs font-medium bg-indigo-100 text-indigo-800 py-1 px-2.5 rounded-full"
              v-if="column.tasks.filter((t) => !t.completed).length > 0"
            >
              {{ column.tasks.filter((t) => !t.completed).length }}
            </span>
          </h2>
          <button
            @click="emit('open-new-task', column.id)"
            class="p-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors"
            title="Add new task"
          >
            <svg
              class="h-5 w-5 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        <div
          class="flex-1 overflow-y-auto bg-gray-100 rounded-xl p-3 min-h-[300px] shadow-inner"
        >
          <!-- Normal View -->
          <div
            v-if="!compactView"
            v-for="task in column.tasks"
            :key="task.id"
            class="bg-white rounded-lg p-4 mb-3 cursor-pointer border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            @click="openTaskDetails(task)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div
                    @click.stop="toggleTaskCompletion(task)"
                    class="h-5 w-5 mr-2 flex-shrink-0 rounded-md cursor-pointer border-2 border-gray-300 hover:border-indigo-500 transition-colors"
                    :class="{ 'bg-indigo-500 border-indigo-500': task.completed }"
                  >
                    <svg
                      v-if="task.completed"
                      class="text-white h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3
                    class="font-medium text-gray-900"
                    :class="{ 'line-through text-gray-400': task.completed }"
                  >
                    {{ task.title }}
                  </h3>
                </div>

                <div
                  v-if="task.description"
                  class="mb-3 pl-7 text-sm text-gray-600 line-clamp-2"
                >
                  {{ task.description }}
                </div>

                <div class="flex flex-wrap gap-1.5 mb-3 pl-7">
                  <span
                    v-for="tag in task.tags"
                    :key="tag"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTagClass(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="flex items-center justify-between pl-7">
                  <div
                    v-if="task.due_date"
                    class="text-xs font-medium flex items-center text-gray-500"
                  >
                    <svg
                      class="h-3.5 w-3.5 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {{ formatDate(task.due_date) }}
                  </div>

                  <div class="ml-auto flex-shrink-0">
                    <div class="flex -space-x-1 overflow-hidden">
                      <img
                        v-for="(assignee, idx) in task.assignees"
                        :key="idx"
                        class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        :src="assignee.avatar"
                        :alt="assignee.name"
                        :title="assignee.name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Compact View -->
          <div
            v-if="compactView"
            v-for="task in column.tasks"
            :key="task.id"
            class="bg-white rounded-lg px-3 py-2 mb-2 cursor-pointer border border-gray-100 hover:border-indigo-200 transition-all duration-200 shadow-sm"
            @click="openTaskDetails(task)"
          >
            <div class="flex items-center justify-between">
              <div
                @click.stop="toggleTaskCompletion(task)"
                class="h-4 w-4 mr-2 flex-shrink-0 rounded-md cursor-pointer border-2 border-gray-300 hover:border-indigo-500 transition-colors"
                :class="{ 'bg-indigo-500 border-indigo-500': task.completed }"
              >
                <svg
                  v-if="task.completed"
                  class="text-white h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3
                class="font-medium text-sm text-gray-900 flex-1 truncate pr-2"
                :class="{ 'line-through text-gray-400': task.completed }"
              >
                {{ task.title }}
              </h3>
              <div class="flex items-center space-x-1">
                <div v-if="task.tags.length > 0" class="flex space-x-1">
                  <div
                    v-for="tag in task.tags.slice(0, 2)"
                    :key="tag"
                    class="w-2 h-2 rounded-full"
                    :class="getTagDotClass(tag)"
                  ></div>
                  <div v-if="task.tags.length > 2" class="text-xs text-gray-400">
                    +{{ task.tags.length - 2 }}
                  </div>
                </div>
                <div v-if="task.due_date" class="text-xs font-medium text-gray-500">
                  {{ formatShortDate(task.due_date) }}
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="column.tasks.length === 0"
            class="flex flex-col items-center justify-center h-32 text-gray-400"
          >
            <svg
              class="h-8 w-8 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p class="text-sm font-medium">No tasks yet</p>
            <button
              @click="emit('open-new-task', column.id)"
              class="mt-2 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              + Add a task
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :show-modal="showTaskModal"
      :initial-task="currentTask"
      @close="closeTaskModal"
      @save="saveTask"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
import { useApi } from "../api";
import TaskModal from "./TaskModal.vue";

const props = defineProps({
  compactView: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["open-new-task"]);

const { loading, error, columns: columnsApi, tasks: tasksApi } = useApi();

// Columns state
const columns = ref([]);

// Task modal state
const showTaskModal = ref(false);
const currentTask = ref({
  title: "",
  description: "",
  due_date: "",
  tags: [],
  column_id: null,
});

// Fetch all columns with tasks
const fetchColumns = async () => {
  try {
    const data = await columnsApi.getAll();
    columns.value = data;
  } catch (err) {
    console.error("Error fetching columns:", err);
  }
};

// Toggle task completion
const toggleTaskCompletion = async (task) => {
  try {
    await tasksApi.toggleComplete(task.id, !task.completed);
    // Update local state
    task.completed = !task.completed;
  } catch (err) {
    console.error(`Error toggling task ${task.id} completion:`, err);
  }
};

// Format date to a more readable format
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Get CSS classes for different tags
const getTagClass = (tag) => {
  const classes = {
    development: "bg-emerald-100 text-emerald-800",
    design: "bg-blue-100 text-blue-800",
    marketing: "bg-rose-100 text-rose-800",
    document: "bg-indigo-100 text-indigo-800",
    content: "bg-purple-100 text-purple-800",
    support: "bg-amber-100 text-amber-800",
    ux: "bg-fuchsia-100 text-fuchsia-800",
    bug: "bg-red-100 text-red-800",
    feature: "bg-green-100 text-green-800",
  };

  return classes[tag.toLowerCase()] || "bg-slate-100 text-slate-800";
};

// Open new task modal
const openNewTaskModal = (columnId) => {
  currentTask.value = {
    title: "",
    description: "",
    due_date: "",
    tags: [],
    column_id: columnId,
  };
  showTaskModal.value = true;
};

// Close the task modal
const closeTaskModal = () => {
  showTaskModal.value = false;
};

// Save the task
const saveTask = async (task) => {
  try {
    if (task.id) {
      // Update existing task
      await tasksApi.update(task.id, task);
    } else {
      // Create new task
      await tasksApi.create(task);
    }

    // Refresh columns to get the updated tasks
    await fetchColumns();

    // Close the modal
    closeTaskModal();
  } catch (err) {
    console.error("Error saving task:", err);
  }
};

// Open task details
const openTaskDetails = (task) => {
  // Set the current task and open the modal
  currentTask.value = { ...task };
  showTaskModal.value = true;
};

// Delete a task
const deleteTask = async (taskId) => {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    await tasksApi.delete(taskId);
    await fetchColumns();
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};

// Define methods for parent component to access
defineExpose({
  columns,
  openNewTaskModal,
  fetchColumns,
});

// Load data when component mounts
onMounted(fetchColumns);

// Watch for changes to compactView to adjust the UI
watch(
  () => props.compactView,
  (newValue) => {
    console.log("Compact view mode:", newValue);
  }
);
</script>

<script>
// Helper methods
export function getTagDotClass(tag) {
  const classes = {
    development: "bg-emerald-500",
    design: "bg-blue-500",
    marketing: "bg-rose-500",
    document: "bg-indigo-500",
    content: "bg-purple-500",
    support: "bg-amber-500",
    ux: "bg-fuchsia-500",
    bug: "bg-red-500",
    feature: "bg-green-500",
  };

  return classes[tag.toLowerCase()] || "bg-slate-500";
}

export function formatShortDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
