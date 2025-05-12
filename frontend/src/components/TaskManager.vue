<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
            <div class="mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <svg class="h-8 w-8 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h1 class="text-xl font-bold text-gray-900 tracking-tight">Task Flow</h1>
                    </div>
                    <div class="flex items-center space-x-5">
                        <div class="relative">
                            <input type="text" placeholder="Search tasks..." class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            <div class="absolute left-3 top-2.5 text-gray-400">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button @click="openNewTaskModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm">
                                <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Task</span>
                            </button>
                            <div class="flex items-center">
                                <img class="h-9 w-9 rounded-full ring-2 ring-indigo-100" src="https://i.pravatar.cc/150?img=1" alt="User profile" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="py-6">
            <div class="mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Board Header with Kanban Controls -->
                <div class="mb-6">
                    <!-- Kanban Board Toolbar -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-6">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div class="flex items-center">
                                <h2 class="text-lg font-bold text-gray-800 mr-4">Kanban Board</h2>
                                <div class="flex space-x-2">
                                    <button @click="openNewColumnModal" class="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors flex items-center">
                                        <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        New Column
                                    </button>
                                </div>
                            </div>

                            <!-- Filter and View Options -->
                            <div class="flex flex-wrap gap-2">
                                <div class="relative">
                                    <button class="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 font-medium text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-colors flex items-center">
                                        <svg class="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        Filter
                                        <svg class="h-4 w-4 ml-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <!-- Filter Dropdown Menu would go here -->
                                </div>

                                <div class="relative">
                                    <button class="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 font-medium text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-colors flex items-center">
                                        <svg class="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                        </svg>
                                        Sort
                                        <svg class="h-4 w-4 ml-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <!-- Sort Dropdown Menu would go here -->
                                </div>

                                <button @click="toggleCompactView" class="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 font-medium text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-colors flex items-center" :class="{ 'bg-indigo-50 text-indigo-700 border-indigo-200': isCompactView }">
                                    <svg class="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                    Compact View
                                </button>
                            </div>
                        </div>

                        <!-- Quick Status Metrics -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div class="bg-indigo-50 rounded-lg p-3">
                                <div class="text-xs text-indigo-600 font-medium">Total Tasks</div>
                                <div class="text-xl font-bold text-indigo-700">{{ totalTasks }}</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-3">
                                <div class="text-xs text-green-600 font-medium">Completed</div>
                                <div class="text-xl font-bold text-green-700">{{ completedTasks }}</div>
                            </div>
                            <div class="bg-amber-50 rounded-lg p-3">
                                <div class="text-xs text-amber-600 font-medium">In Progress</div>
                                <div class="text-xl font-bold text-amber-700">{{ inProgressTasks }}</div>
                            </div>
                            <div class="bg-gray-50 rounded-lg p-3">
                                <div class="text-xs text-gray-600 font-medium">Columns</div>
                                <div class="text-xl font-bold text-gray-700">{{ columnCount }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Task Board -->
                <TaskBoard ref="taskBoardRef" :compact-view="isCompactView" @open-new-task="openNewTaskModal" />
            </div>
        </main>

        <!-- New Column Modal (Placeholder) -->
        <div v-if="showColumnModal" class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showColumnModal = false">
                    <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
                </div>
                <div class="transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 class="text-lg font-bold leading-6 text-gray-900 border-b pb-2">
                            Add New Column
                        </h3>
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700">Column Name</label>
                            <input v-model="newColumnName" type="text" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Enter column name...">
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button @click="addNewColumn" class="inline-flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                            Add Column
                        </button>
                        <button @click="showColumnModal = false" class="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TaskBoard from './TaskBoard.vue';
import { useApi } from '../api';

const taskBoardRef = ref(null);
const { columns: columnsApi } = useApi();

// Kanban board state
const isCompactView = ref(false);
const showColumnModal = ref(false);
const newColumnName = ref('');

// Board metrics
const totalTasks = ref(0);
const completedTasks = ref(0);
const inProgressTasks = ref(0);
const columnCount = ref(0);

// Update board metrics
const updateBoardMetrics = () => {
    if (!taskBoardRef.value) return;

    const columns = taskBoardRef.value.columns;

    let total = 0;
    let completed = 0;
    let inProgress = 0;

    columns.forEach(column => {
        total += column.tasks.length;
        column.tasks.forEach(task => {
            if (task.completed) completed++;
            else inProgress++;
        });
    });

    totalTasks.value = total;
    completedTasks.value = completed;
    inProgressTasks.value = inProgress;
    columnCount.value = columns.length;
};

// Toggle compact view
const toggleCompactView = () => {
    isCompactView.value = !isCompactView.value;
};

// Open new task modal
const openNewTaskModal = (columnId) => {
    if (taskBoardRef.value) {
        taskBoardRef.value.openNewTaskModal(columnId || taskBoardRef.value.columns[0]?.id);
    }
};

// Open new column modal
const openNewColumnModal = () => {
    showColumnModal.value = true;
    newColumnName.value = '';
};

// Add new column
const addNewColumn = async () => {
    if (!newColumnName.value.trim()) return;

    try {
        await columnsApi.create({ title: newColumnName.value.trim() });

        // Refresh the board
        if (taskBoardRef.value) {
            await taskBoardRef.value.fetchColumns();
            updateBoardMetrics();
        }

        showColumnModal.value = false;
    } catch (err) {
        console.error('Error creating column:', err);
    }
};

// Watch for changes in the task board
onMounted(() => {
    // Initial metrics update
    setTimeout(updateBoardMetrics, 500);
});
</script>

<style scoped>
/* Additional styles can be added here */
</style>