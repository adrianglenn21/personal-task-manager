const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');

// GET /api/columns - Get all columns
router.get('/', columnController.getAllColumns);

// GET /api/columns/:id - Get column by ID
router.get('/:id', columnController.getColumnById);

// POST /api/columns - Create new column
router.post('/', columnController.createColumn);

// PUT /api/columns/:id - Update column
router.put('/:id', columnController.updateColumn);

// DELETE /api/columns/:id - Delete column
router.delete('/:id', columnController.deleteColumn);

// POST /api/columns/reorder - Reorder columns
router.post('/reorder', columnController.reorderColumns);

module.exports = router; 