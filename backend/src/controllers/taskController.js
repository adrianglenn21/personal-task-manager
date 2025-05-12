const Task = require('../models/task');

// Get all tasks
const getAllTasks = (req, res) => {
    Task.getAll((err, tasks) => {
        if (err) {
            console.error('Error getting tasks:', err);
            return res.status(500).json({ error: 'Failed to get tasks' });
        }
        res.json(tasks);
    });
};

// Get task by ID
const getTaskById = (req, res) => {
    const taskId = req.params.id;

    Task.getById(taskId, (err, task) => {
        if (err) {
            console.error(`Error getting task ${taskId}:`, err);
            return res.status(500).json({ error: 'Failed to get task' });
        }

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    });
};

// Create new task
const createTask = (req, res) => {
    const { title, description, column_id, completed, due_date, tags, assignees } = req.body;

    // Validate required fields
    if (!title || !column_id) {
        return res.status(400).json({ error: 'Title and column_id are required' });
    }

    const taskData = {
        title,
        description,
        column_id,
        completed: !!completed,
        due_date,
        tags: tags || [],
        assignees: assignees || []
    };

    Task.create(taskData, (err, task) => {
        if (err) {
            console.error('Error creating task:', err);
            return res.status(500).json({ error: 'Failed to create task' });
        }

        res.status(201).json(task);
    });
};

// Update task
const updateTask = (req, res) => {
    const taskId = req.params.id;
    const { title, description, column_id, completed, due_date, tags, assignees } = req.body;

    const taskData = {};

    // Only include fields that are present in the request
    if (title !== undefined) taskData.title = title;
    if (description !== undefined) taskData.description = description;
    if (column_id !== undefined) taskData.column_id = column_id;
    if (completed !== undefined) taskData.completed = !!completed;
    if (due_date !== undefined) taskData.due_date = due_date;
    if (tags !== undefined) taskData.tags = tags;
    if (assignees !== undefined) taskData.assignees = assignees;

    Task.update(taskId, taskData, (err, task) => {
        if (err) {
            console.error(`Error updating task ${taskId}:`, err);

            if (err.message === 'Task not found') {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.status(500).json({ error: 'Failed to update task' });
        }

        res.json(task);
    });
};

// Delete task
const deleteTask = (req, res) => {
    const taskId = req.params.id;

    Task.delete(taskId, (err) => {
        if (err) {
            console.error(`Error deleting task ${taskId}:`, err);
            return res.status(500).json({ error: 'Failed to delete task' });
        }

        res.status(204).end();
    });
};

// Move task to different column and/or position
const moveTask = (req, res) => {
    const taskId = req.params.id;
    const { column_id, position } = req.body;

    // Validate required fields
    if (!column_id || position === undefined || position < 0) {
        return res.status(400).json({ error: 'column_id and position are required' });
    }

    Task.move(taskId, column_id, position, (err, task) => {
        if (err) {
            console.error(`Error moving task ${taskId}:`, err);

            if (err.message === 'Task not found') {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.status(500).json({ error: 'Failed to move task' });
        }

        res.json(task);
    });
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    moveTask
}; 