const Column = require('../models/column');

// Get all columns with tasks
const getAllColumns = (req, res) => {
    Column.getAllWithTasks((err, columns) => {
        if (err) {
            console.error('Error getting columns:', err);
            return res.status(500).json({ error: 'Failed to get columns' });
        }
        res.json(columns);
    });
};

// Get column by ID
const getColumnById = (req, res) => {
    const columnId = req.params.id;

    Column.getById(columnId, (err, column) => {
        if (err) {
            console.error(`Error getting column ${columnId}:`, err);
            return res.status(500).json({ error: 'Failed to get column' });
        }

        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }

        res.json(column);
    });
};

// Create new column
const createColumn = (req, res) => {
    const { id, title } = req.body;

    // Validate required fields
    if (!id || !title) {
        return res.status(400).json({ error: 'ID and title are required' });
    }

    const columnData = { id, title };

    Column.create(columnData, (err, column) => {
        if (err) {
            console.error('Error creating column:', err);
            return res.status(500).json({ error: 'Failed to create column' });
        }

        res.status(201).json(column);
    });
};

// Update column
const updateColumn = (req, res) => {
    const columnId = req.params.id;
    const { title } = req.body;

    // Validate required fields
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const columnData = { title };

    Column.update(columnId, columnData, (err, column) => {
        if (err) {
            console.error(`Error updating column ${columnId}:`, err);

            if (err.message === 'Column not found') {
                return res.status(404).json({ error: 'Column not found' });
            }

            return res.status(500).json({ error: 'Failed to update column' });
        }

        res.json(column);
    });
};

// Delete column
const deleteColumn = (req, res) => {
    const columnId = req.params.id;

    Column.delete(columnId, (err) => {
        if (err) {
            console.error(`Error deleting column ${columnId}:`, err);

            if (err.message === 'Column not found') {
                return res.status(404).json({ error: 'Column not found' });
            }

            return res.status(500).json({ error: 'Failed to delete column' });
        }

        res.status(204).end();
    });
};

// Reorder columns
const reorderColumns = (req, res) => {
    const { columnIds } = req.body;

    // Validate required fields
    if (!columnIds || !Array.isArray(columnIds) || columnIds.length === 0) {
        return res.status(400).json({ error: 'Column IDs array is required' });
    }

    Column.reorder(columnIds, (err) => {
        if (err) {
            console.error('Error reordering columns:', err);
            return res.status(500).json({ error: 'Failed to reorder columns' });
        }

        // Get all columns with updated positions
        Column.getAllWithTasks((err, columns) => {
            if (err) {
                console.error('Error getting columns after reordering:', err);
                return res.status(500).json({ error: 'Columns reordered but failed to retrieve updated data' });
            }

            res.json(columns);
        });
    });
};

module.exports = {
    getAllColumns,
    getColumnById,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns
}; 