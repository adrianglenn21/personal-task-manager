# Personal Task Manager

A modern Kanban-style task management application built with Vue.js, Express, and SQLite.

![Task Manager Screenshot](screenshot.png)

## Features

- Responsive Kanban board layout
- Task creation and management 
- Task tagging and assignments
- SQLite database for data persistence
- RESTful API backend

## Project Structure

The project is divided into two main parts:

- `frontend/`: A Vue.js application
- `backend/`: An Express.js API with SQLite database

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/personal-task-manager.git
cd personal-task-manager
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server (from the backend directory):
```bash
npm run dev
```
The backend will run on http://localhost:3000.

2. Start the frontend development server (from the frontend directory):
```bash
npm run dev
```
The frontend will run on http://localhost:5173 (or another port if 5173 is in use).

3. Open your browser and visit http://localhost:5173.

## Development

### Backend

The backend is built with:
- Express.js - Web framework
- SQLite - Database
- RESTful API architecture

For more details on the backend, check out the [backend README](backend/README.md).

### Frontend

The frontend is built with:
- Vue.js 3 - UI framework
- Tailwind CSS - Styling
- Font Awesome - Icons

For more details on the frontend, check out the [frontend README](frontend/README.md).

## API Endpoints

The backend provides the following API endpoints:

- `/api/tasks` - CRUD operations for tasks
- `/api/columns` - CRUD operations for columns
- `/api/users` - CRUD operations for users

For detailed API documentation, visit http://localhost:3000/api when the backend is running.

## License

MIT 