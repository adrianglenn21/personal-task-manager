const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'task_manager.db');

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Create tables if they don't exist
    createTables();
});

// Create tables
function createTables() {
    // Create columns table (Kanban board columns)
    db.run(`
    CREATE TABLE IF NOT EXISTS columns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      position INTEGER NOT NULL
    )
  `, (err) => {
        if (err) {
            console.error('Error creating columns table:', err.message);
        } else {
            console.log('Columns table created or already exists');

            // Insert default columns if the table is empty
            db.get('SELECT COUNT(*) as count FROM columns', (err, row) => {
                if (err) {
                    console.error('Error checking columns count:', err.message);
                } else if (row.count === 0) {
                    // Insert default columns
                    const defaultColumns = [
                        { id: 'backlog', title: 'Backlog', position: 1 },
                        { id: 'todo', title: 'To Do', position: 2 },
                        { id: 'doing', title: 'Doing', position: 3 },
                        { id: 'review', title: 'Review', position: 4 }
                    ];

                    defaultColumns.forEach(column => {
                        db.run(`
              INSERT INTO columns (id, title, position) 
              VALUES (?, ?, ?)
            `, [column.id, column.title, column.position], (err) => {
                            if (err) {
                                console.error(`Error inserting default column ${column.title}:`, err.message);
                            } else {
                                console.log(`Default column ${column.title} inserted`);
                            }
                        });
                    });
                }
            });
        }
    });

    // Create tasks table
    db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      column_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      due_date TEXT,
      position INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
    )
  `, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err.message);
        } else {
            console.log('Tasks table created or already exists');
        }
    });

    // Create tags table
    db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `, (err) => {
        if (err) {
            console.error('Error creating tags table:', err.message);
        } else {
            console.log('Tags table created or already exists');

            // Insert default tags if the table is empty
            db.get('SELECT COUNT(*) as count FROM tags', (err, row) => {
                if (err) {
                    console.error('Error checking tags count:', err.message);
                } else if (row.count === 0) {
                    // Insert default tags
                    const defaultTags = [
                        'development', 'design', 'marketing', 'document', 'content', 'support', 'UX'
                    ];

                    defaultTags.forEach(tag => {
                        db.run(`
              INSERT INTO tags (name) 
              VALUES (?)
            `, [tag], (err) => {
                            if (err) {
                                console.error(`Error inserting default tag ${tag}:`, err.message);
                            } else {
                                console.log(`Default tag ${tag} inserted`);
                            }
                        });
                    });
                }
            });
        }
    });

    // Create task_tags junction table
    db.run(`
    CREATE TABLE IF NOT EXISTS task_tags (
      task_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (task_id, tag_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `, (err) => {
        if (err) {
            console.error('Error creating task_tags table:', err.message);
        } else {
            console.log('Task_tags table created or already exists');
        }
    });

    // Create users table
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      avatar TEXT
    )
  `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created or already exists');

            // Insert default users if the table is empty
            db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                if (err) {
                    console.error('Error checking users count:', err.message);
                } else if (row.count === 0) {
                    // Insert default users
                    const defaultUsers = [
                        { name: 'Alex Smith', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
                        { name: 'Jane Doe', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
                        { name: 'Mark Johnson', email: 'mark@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
                        { name: 'Emily Davis', email: 'emily@example.com', avatar: 'https://i.pravatar.cc/150?img=6' }
                    ];

                    defaultUsers.forEach(user => {
                        db.run(`
              INSERT INTO users (name, email, avatar) 
              VALUES (?, ?, ?)
            `, [user.name, user.email, user.avatar], (err) => {
                            if (err) {
                                console.error(`Error inserting default user ${user.name}:`, err.message);
                            } else {
                                console.log(`Default user ${user.name} inserted`);
                            }
                        });
                    });
                }
            });
        }
    });

    // Create task_assignees junction table
    db.run(`
    CREATE TABLE IF NOT EXISTS task_assignees (
      task_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (task_id, user_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
        if (err) {
            console.error('Error creating task_assignees table:', err.message);
        } else {
            console.log('Task_assignees table created or already exists');
        }
    });
}

// Export the database instance
module.exports = db; 