# Personal Task Manager

A modern Kanban-style task management application built with Vue.js and Tailwind CSS.

## Features

- Responsive Kanban board layout
- Task creation and management
- Drag-and-drop functionality (coming soon)
- Task filtering and sorting (coming soon)
- User authentication (coming soon)

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/personal-task-manager.git
cd personal-task-manager/frontend
```

2. Install the dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Building for Production

To build the application for production, run:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- Vue.js 3 (Composition API)
- Tailwind CSS
- Font Awesome
- Vite

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Vue components
│   ├── composables/     # Reusable composition functions
│   ├── App.vue          # Root component
│   ├── main.js          # Application entry point
│   └── style.css        # Global styles
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## License

MIT