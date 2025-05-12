const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const columnRoutes = require('./routes/columnRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize database
require('./db/database');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/tasks', taskRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/users', userRoutes);

// Serve static files from frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    });
}

// API information route
app.get('/api', (req, res) => {
    res.json({
        message: 'Task Manager API',
        endpoints: [
            { path: '/api/tasks', methods: ['GET', 'POST'] },
            { path: '/api/tasks/:id', methods: ['GET', 'PUT', 'DELETE'] },
            { path: '/api/tasks/:id/move', methods: ['PATCH'] },
            { path: '/api/columns', methods: ['GET', 'POST'] },
            { path: '/api/columns/:id', methods: ['GET', 'PUT', 'DELETE'] },
            { path: '/api/columns/reorder', methods: ['POST'] },
            { path: '/api/users', methods: ['GET', 'POST'] },
            { path: '/api/users/:id', methods: ['GET', 'PUT', 'DELETE'] },
            { path: '/api/users/task/:taskId', methods: ['GET'] }
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 