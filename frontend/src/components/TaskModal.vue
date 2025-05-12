<template>
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <!-- Backdrop -->
            <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeModal">
                <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
            </div>

            <!-- Modal panel -->
            <div class="transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div class="absolute right-0 top-0 pr-4 pt-4">
                    <button type="button" @click="closeModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            <h3 class="text-lg font-bold leading-6 text-gray-900 border-b pb-2">
                                {{ task.id ? 'Edit Task' : 'Create New Task' }}
                            </h3>

                            <div class="mt-4 space-y-5">
                                <div>
                                    <label for="title" class="block text-sm font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
                                    <input type="text" name="title" id="title" v-model="task.title" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Enter task title" required>
                                </div>

                                <div>
                                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea id="description" name="description" v-model="task.description" rows="3" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Describe this task..."></textarea>
                                </div>

                                <div>
                                    <label for="due_date" class="block text-sm font-medium text-gray-700">Due Date</label>
                                    <input type="date" id="due_date" name="due_date" v-model="task.due_date" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                </div>

                                <div>
                                    <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
                                    <div class="mt-1 relative">
                                        <div class="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-lg border border-gray-300 mb-1">
                                            <span v-for="tag in task.tags" :key="tag" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTagClass(tag)">
                                                {{ tag }}
                                                <button @click="removeTag(tag)" class="ml-1 text-gray-500 hover:text-gray-700">
                                                    <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </button>
                                            </span>
                                        </div>

                                        <input type="text" id="tags" v-model="newTag" @keydown.enter.prevent="addTag" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Type a tag and press Enter">

                                        <div class="mt-1 text-xs text-gray-500">
                                            Popular tags:
                                            <button @click="addTagFromSuggestion('feature')" class="text-indigo-600 hover:text-indigo-800">feature</button>,
                                            <button @click="addTagFromSuggestion('bug')" class="text-indigo-600 hover:text-indigo-800">bug</button>,
                                            <button @click="addTagFromSuggestion('design')" class="text-indigo-600 hover:text-indigo-800">design</button>,
                                            <button @click="addTagFromSuggestion('development')" class="text-indigo-600 hover:text-indigo-800">development</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" class="inline-flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors" @click="saveTask">
                        {{ task.id ? 'Save Changes' : 'Create Task' }}
                    </button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors" @click="closeModal">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    initialTask: {
        type: Object,
        default: () => ({
            title: '',
            description: '',
            due_date: '',
            tags: [],
            column_id: null
        })
    }
});

const emit = defineEmits(['close', 'save']);

// Create a copy of the task to avoid directly modifying props
const task = ref({ ...props.initialTask });
const newTag = ref('');

// Watch for changes in props to update local state
watch(() => props.initialTask, (newValue) => {
    task.value = { ...newValue };
}, { deep: true });

// Close the modal
const closeModal = () => {
    emit('close');
};

// Add a new tag
const addTag = () => {
    if (newTag.value.trim() === '') return;

    // Check if tag already exists
    if (!task.value.tags.includes(newTag.value.trim())) {
        task.value.tags.push(newTag.value.trim());
    }

    newTag.value = '';
};

// Add a tag from suggestion
const addTagFromSuggestion = (tag) => {
    if (!task.value.tags.includes(tag)) {
        task.value.tags.push(tag);
    }
};

// Remove a tag
const removeTag = (tag) => {
    task.value.tags = task.value.tags.filter(t => t !== tag);
};

// Get CSS classes for different tags
const getTagClass = (tag) => {
    const classes = {
        development: 'bg-emerald-100 text-emerald-800',
        design: 'bg-blue-100 text-blue-800',
        marketing: 'bg-rose-100 text-rose-800',
        document: 'bg-indigo-100 text-indigo-800',
        content: 'bg-purple-100 text-purple-800',
        support: 'bg-amber-100 text-amber-800',
        ux: 'bg-fuchsia-100 text-fuchsia-800',
        bug: 'bg-red-100 text-red-800',
        feature: 'bg-green-100 text-green-800'
    };

    return classes[tag.toLowerCase()] || 'bg-slate-100 text-slate-800';
};

// Save the task
const saveTask = () => {
    if (!task.value.title) {
        alert('Task title is required');
        return;
    }

    emit('save', task.value);
};
</script>

<style scoped>
/* Extra styles for the modal if needed */
</style>