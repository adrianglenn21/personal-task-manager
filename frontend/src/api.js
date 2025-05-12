import { ref } from 'vue';

// API base URL - change to match your backend server URL
const API_BASE_URL = 'http://localhost:3000/api';

export function useApi() {
    const loading = ref(false);
    const error = ref(null);

    // Generic API request function with error handling
    const request = async (endpoint, method = 'GET', data = null) => {
        loading.value = true;
        error.value = null;

        const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            // Handle non-2xx responses
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
            }

            // Handle 204 No Content responses
            if (response.status === 204) {
                loading.value = false;
                return null;
            }

            const result = await response.json();
            loading.value = false;
            return result;
        } catch (err) {
            loading.value = false;
            error.value = err.message;
            console.error('API Error:', err);
            throw err;
        }
    };

    // Task API functions
    const tasks = {
        getAll: () => request('/tasks'),
        getById: (id) => request(`/tasks/${id}`),
        create: (task) => request('/tasks', 'POST', task),
        update: (id, task) => request(`/tasks/${id}`, 'PUT', task),
        delete: (id) => request(`/tasks/${id}`, 'DELETE'),
        move: (id, columnId, position) => request(`/tasks/${id}/move`, 'PATCH', { column_id: columnId, position }),
        toggleComplete: (id, completed) => request(`/tasks/${id}`, 'PUT', { completed }),
    };

    // Column API functions
    const columns = {
        getAll: () => request('/columns'),
        getById: (id) => request(`/columns/${id}`),
        create: (column) => request('/columns', 'POST', column),
        update: (id, column) => request(`/columns/${id}`, 'PUT', column),
        delete: (id) => request(`/columns/${id}`, 'DELETE'),
        reorder: (columnIds) => request('/columns/reorder', 'POST', { columnIds }),
    };

    // User API functions
    const users = {
        getAll: () => request('/users'),
        getById: (id) => request(`/users/${id}`),
        getByTaskId: (taskId) => request(`/users/task/${taskId}`),
        create: (user) => request('/users', 'POST', user),
        update: (id, user) => request(`/users/${id}`, 'PUT', user),
        delete: (id) => request(`/users/${id}`, 'DELETE'),
    };

    return {
        loading,
        error,
        tasks,
        columns,
        users
    };
} 