const User = require('../models/user');

// Get all users
const getAllUsers = (req, res) => {
    User.getAll((err, users) => {
        if (err) {
            console.error('Error getting users:', err);
            return res.status(500).json({ error: 'Failed to get users' });
        }
        res.json(users);
    });
};

// Get user by ID
const getUserById = (req, res) => {
    const userId = req.params.id;

    User.getById(userId, (err, user) => {
        if (err) {
            console.error(`Error getting user ${userId}:`, err);
            return res.status(500).json({ error: 'Failed to get user' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    });
};

// Create new user
const createUser = (req, res) => {
    const { name, email, avatar } = req.body;

    // Validate required fields
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const userData = { name, email, avatar };

    User.create(userData, (err, user) => {
        if (err) {
            console.error('Error creating user:', err);

            // Check for duplicate email
            if (err.message && err.message.includes('UNIQUE constraint failed: users.email')) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            return res.status(500).json({ error: 'Failed to create user' });
        }

        res.status(201).json(user);
    });
};

// Update user
const updateUser = (req, res) => {
    const userId = req.params.id;
    const { name, email, avatar } = req.body;

    // Validate required fields
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const userData = { name, email, avatar };

    User.update(userId, userData, (err, user) => {
        if (err) {
            console.error(`Error updating user ${userId}:`, err);

            if (err.message === 'User not found') {
                return res.status(404).json({ error: 'User not found' });
            }

            // Check for duplicate email
            if (err.message && err.message.includes('UNIQUE constraint failed: users.email')) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            return res.status(500).json({ error: 'Failed to update user' });
        }

        res.json(user);
    });
};

// Delete user
const deleteUser = (req, res) => {
    const userId = req.params.id;

    User.delete(userId, (err) => {
        if (err) {
            console.error(`Error deleting user ${userId}:`, err);

            if (err.message === 'User not found') {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(500).json({ error: 'Failed to delete user' });
        }

        res.status(204).end();
    });
};

// Get users assigned to a task
const getUsersByTaskId = (req, res) => {
    const taskId = req.params.taskId;

    User.getByTaskId(taskId, (err, users) => {
        if (err) {
            console.error(`Error getting users for task ${taskId}:`, err);
            return res.status(500).json({ error: 'Failed to get users for task' });
        }

        res.json(users);
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersByTaskId
}; 