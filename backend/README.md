# Task Manager Backend API

A RESTful API for the Personal Task Manager application built with Node.js, Express, and SQLite.

## Features

- CRUD operations for tasks, columns, and users
- Support for task tags and assignees
- Task reordering and column reordering
- SQLite database for persistence

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository (if not already done):
```bash
git clone https://github.com/yourusername/personal-task-manager.git
cd personal-task-manager/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on port 3000 by default. You can access the API at `http://localhost:3000/api`.

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/move` - Move a task to a different column or position

### Columns

- `GET /api/columns` - Get all columns with their tasks
- `GET /api/columns/:id` - Get a specific column with its tasks
- `POST /api/columns` - Create a new column
- `PUT /api/columns/:id` - Update a column
- `DELETE /api/columns/:id` - Delete a column
- `POST /api/columns/reorder` - Reorder columns

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/users/task/:taskId` - Get users assigned to a specific task

## Database Schema

The application uses SQLite with the following tables:

- `columns` - Represents Kanban board columns
- `tasks` - Represents tasks in the board
- `tags` - Represents task tags
- `task_tags` - Junction table for task-tag relationships
- `users` - Represents users
- `task_assignees` - Junction table for task-user assignments

## Development

For development, the server uses nodemon to automatically restart when changes are detected.

```bash
npm run dev
```

For production, use:

```bash
npm start
``` 