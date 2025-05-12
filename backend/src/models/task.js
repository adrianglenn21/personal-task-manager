const db = require('../db/database');

class Task {
    // Get all tasks
    static getAll(callback) {
        const sql = `
      SELECT t.*, GROUP_CONCAT(tag.name) as tags
      FROM tasks t
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags tag ON tt.tag_id = tag.id
      GROUP BY t.id
      ORDER BY t.position
    `;

        db.all(sql, [], (err, tasks) => {
            if (err) {
                return callback(err, null);
            }

            // Process tasks to convert tags string to array
            const processedTasks = tasks.map(task => {
                return {
                    ...task,
                    tags: task.tags ? task.tags.split(',') : [],
                    completed: task.completed === 1
                };
            });

            this.getTaskAssignees(processedTasks, callback);
        });
    }

    // Get tasks by column ID
    static getByColumn(columnId, callback) {
        const sql = `
      SELECT t.*, GROUP_CONCAT(tag.name) as tags
      FROM tasks t
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags tag ON tt.tag_id = tag.id
      WHERE t.column_id = ?
      GROUP BY t.id
      ORDER BY t.position
    `;

        db.all(sql, [columnId], (err, tasks) => {
            if (err) {
                return callback(err, null);
            }

            // Process tasks to convert tags string to array
            const processedTasks = tasks.map(task => {
                return {
                    ...task,
                    tags: task.tags ? task.tags.split(',') : [],
                    completed: task.completed === 1
                };
            });

            this.getTaskAssignees(processedTasks, callback);
        });
    }

    // Get task by ID
    static getById(id, callback) {
        const sql = `
      SELECT t.*, GROUP_CONCAT(tag.name) as tags
      FROM tasks t
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags tag ON tt.tag_id = tag.id
      WHERE t.id = ?
      GROUP BY t.id
    `;

        db.get(sql, [id], (err, task) => {
            if (err) {
                return callback(err, null);
            }

            if (!task) {
                return callback(null, null);
            }

            // Process task to convert tags string to array
            const processedTask = {
                ...task,
                tags: task.tags ? task.tags.split(',') : [],
                completed: task.completed === 1
            };

            // Get assignees for the task
            this.getTaskAssignees([processedTask], (err, tasksWithAssignees) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, tasksWithAssignees[0]);
            });
        });
    }

    // Get assignees for tasks
    static getTaskAssignees(tasks, callback) {
        if (tasks.length === 0) {
            return callback(null, []);
        }

        const taskIds = tasks.map(t => t.id).join(',');
        const sql = `
      SELECT ta.task_id, u.id, u.name, u.avatar
      FROM task_assignees ta
      JOIN users u ON ta.user_id = u.id
      WHERE ta.task_id IN (${taskIds})
    `;

        db.all(sql, [], (err, assigneeRows) => {
            if (err) {
                return callback(err, null);
            }

            // Group assignees by task_id
            const assigneesByTask = {};
            assigneeRows.forEach(row => {
                if (!assigneesByTask[row.task_id]) {
                    assigneesByTask[row.task_id] = [];
                }
                assigneesByTask[row.task_id].push({
                    id: row.id,
                    name: row.name,
                    avatar: row.avatar
                });
            });

            // Add assignees to each task
            const tasksWithAssignees = tasks.map(task => {
                return {
                    ...task,
                    assignees: assigneesByTask[task.id] || []
                };
            });

            callback(null, tasksWithAssignees);
        });
    }

    // Create a new task
    static create(taskData, callback) {
        // First, we need to calculate the position for the new task
        const positionSql = `
      SELECT COALESCE(MAX(position), 0) + 1 as new_position
      FROM tasks
      WHERE column_id = ?
    `;

        db.get(positionSql, [taskData.column_id], (err, positionRow) => {
            if (err) {
                return callback(err, null);
            }

            const position = positionRow.new_position;
            const self = this; // Store reference to Task class

            // Begin transaction
            db.serialize(() => {
                db.run('BEGIN TRANSACTION', (err) => {
                    if (err) {
                        return callback(err, null);
                    }

                    // Insert the task
                    const insertSql = `
          INSERT INTO tasks (title, description, column_id, completed, due_date, position)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

                    db.run(insertSql, [
                        taskData.title,
                        taskData.description || '',
                        taskData.column_id,
                        taskData.completed ? 1 : 0,
                        taskData.due_date || null,
                        position
                    ], function (err) {
                        if (err) {
                            // Safely rollback the transaction
                            return db.run('ROLLBACK', () => callback(err, null));
                        }

                        const taskId = this.lastID;
                        let hasError = false;

                        // Process assignees if they exist
                        const assigneePromises = [];
                        if (taskData.assignees && taskData.assignees.length > 0) {
                            taskData.assignees.forEach(userId => {
                                assigneePromises.push(new Promise((resolve, reject) => {
                                    db.run(
                                        'INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)',
                                        [taskId, userId],
                                        err => {
                                            if (err) reject(err);
                                            else resolve();
                                        }
                                    );
                                }));
                            });
                        }

                        // Process tags if they exist
                        const tagPromises = [];
                        if (taskData.tags && taskData.tags.length > 0) {
                            taskData.tags.forEach(tagName => {
                                tagPromises.push(new Promise((resolve, reject) => {
                                    // First ensure the tag exists
                                    db.get('SELECT id FROM tags WHERE name = ?', [tagName], (err, tagRow) => {
                                        if (err) return reject(err);

                                        let tagId;
                                        if (tagRow) {
                                            tagId = tagRow.id;
                                            createTaskTagRelation(tagId, resolve, reject);
                                        } else {
                                            // Create tag if it doesn't exist
                                            db.run('INSERT INTO tags (name) VALUES (?)', [tagName], function (err) {
                                                if (err) return reject(err);
                                                tagId = this.lastID;
                                                createTaskTagRelation(tagId, resolve, reject);
                                            });
                                        }
                                    });

                                    function createTaskTagRelation(tagId, resolve, reject) {
                                        db.run(
                                            'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)',
                                            [taskId, tagId],
                                            err => {
                                                if (err) reject(err);
                                                else resolve();
                                            }
                                        );
                                    }
                                }));
                            });
                        }

                        // Wait for all promises to complete
                        Promise.all([...assigneePromises, ...tagPromises])
                            .then(() => {
                                db.run('COMMIT', (err) => {
                                    if (err) {
                                        return callback(err, null);
                                    }
                                    self.getById(taskId, callback); // Use the stored reference
                                });
                            })
                            .catch(err => {
                                // Safely rollback the transaction
                                db.run('ROLLBACK', () => callback(err, null));
                            });
                    });
                });
            });
        });
    }

    // Update a task
    static update(id, taskData, callback) {
        this.getById(id, (err, existingTask) => {
            if (err) {
                return callback(err, null);
            }

            if (!existingTask) {
                return callback(new Error('Task not found'), null);
            }

            const self = this; // Store reference to Task class

            // Begin transaction
            db.serialize(() => {
                db.run('BEGIN TRANSACTION', (err) => {
                    if (err) {
                        return callback(err, null);
                    }

                    // Update the task
                    const updateSql = `
          UPDATE tasks
          SET title = ?,
              description = ?,
              column_id = ?,
              completed = ?,
              due_date = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;

                    db.run(updateSql, [
                        taskData.title || existingTask.title,
                        taskData.description !== undefined ? taskData.description : existingTask.description,
                        taskData.column_id || existingTask.column_id,
                        taskData.completed !== undefined ? (taskData.completed ? 1 : 0) : existingTask.completed ? 1 : 0,
                        taskData.due_date !== undefined ? taskData.due_date : existingTask.due_date,
                        id
                    ], function (err) {
                        if (err) {
                            return db.run('ROLLBACK', () => callback(err, null));
                        }

                        // Only update assignees if provided in the request
                        let assigneesPromise = Promise.resolve();
                        if (taskData.assignees !== undefined) {
                            assigneesPromise = new Promise((resolve, reject) => {
                                // Delete existing assignees
                                db.run('DELETE FROM task_assignees WHERE task_id = ?', [id], err => {
                                    if (err) return reject(err);

                                    // If assignees array is empty, we're done
                                    if (!taskData.assignees || taskData.assignees.length === 0) {
                                        return resolve();
                                    }

                                    // Add new assignees
                                    const assigneePromises = taskData.assignees.map(userId =>
                                        new Promise((resolve, reject) => {
                                            db.run(
                                                'INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)',
                                                [id, userId],
                                                err => {
                                                    if (err) reject(err);
                                                    else resolve();
                                                }
                                            );
                                        })
                                    );

                                    Promise.all(assigneePromises)
                                        .then(resolve)
                                        .catch(reject);
                                });
                            });
                        }

                        // Only update tags if provided in the request
                        let tagsPromise = Promise.resolve();
                        if (taskData.tags !== undefined) {
                            tagsPromise = new Promise((resolve, reject) => {
                                // Delete existing tags
                                db.run('DELETE FROM task_tags WHERE task_id = ?', [id], err => {
                                    if (err) return reject(err);

                                    // If tags array is empty, we're done
                                    if (!taskData.tags || taskData.tags.length === 0) {
                                        return resolve();
                                    }

                                    // Add new tags
                                    const tagPromises = taskData.tags.map(tagName =>
                                        new Promise((resolve, reject) => {
                                            // First ensure the tag exists
                                            db.get('SELECT id FROM tags WHERE name = ?', [tagName], (err, tagRow) => {
                                                if (err) return reject(err);

                                                let tagId;
                                                if (tagRow) {
                                                    tagId = tagRow.id;
                                                    createTaskTagRelation(tagId, resolve, reject);
                                                } else {
                                                    // Create tag if it doesn't exist
                                                    db.run('INSERT INTO tags (name) VALUES (?)', [tagName], function (err) {
                                                        if (err) return reject(err);
                                                        tagId = this.lastID;
                                                        createTaskTagRelation(tagId, resolve, reject);
                                                    });
                                                }
                                            });

                                            function createTaskTagRelation(tagId, resolve, reject) {
                                                db.run(
                                                    'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)',
                                                    [id, tagId],
                                                    err => {
                                                        if (err) reject(err);
                                                        else resolve();
                                                    }
                                                );
                                            }
                                        })
                                    );

                                    Promise.all(tagPromises)
                                        .then(resolve)
                                        .catch(reject);
                                });
                            });
                        }

                        // Wait for all promises to complete
                        Promise.all([assigneesPromise, tagsPromise])
                            .then(() => {
                                db.run('COMMIT', (err) => {
                                    if (err) {
                                        return callback(err, null);
                                    }
                                    self.getById(id, callback); // Use the stored reference
                                });
                            })
                            .catch(err => {
                                db.run('ROLLBACK', () => callback(err, null));
                            });
                    });
                });
            });
        });
    }

    // Delete a task
    static delete(id, callback) {
        // Begin transaction
        db.serialize(() => {
            db.run('BEGIN TRANSACTION', (err) => {
                if (err) {
                    return callback(err);
                }

                // Delete task tags
                db.run('DELETE FROM task_tags WHERE task_id = ?', [id], err => {
                    if (err) {
                        return db.run('ROLLBACK', () => callback(err));
                    }

                    // Delete task assignees
                    db.run('DELETE FROM task_assignees WHERE task_id = ?', [id], err => {
                        if (err) {
                            return db.run('ROLLBACK', () => callback(err));
                        }

                        // Delete the task
                        db.run('DELETE FROM tasks WHERE id = ?', [id], err => {
                            if (err) {
                                return db.run('ROLLBACK', () => callback(err));
                            }

                            db.run('COMMIT', (err) => {
                                if (err) {
                                    return callback(err);
                                }
                                callback(null);
                            });
                        });
                    });
                });
            });
        });
    }

    // Move task to different column and/or position
    static move(id, columnId, position, callback) {
        this.getById(id, (err, task) => {
            if (err) {
                return callback(err, null);
            }

            if (!task) {
                return callback(new Error('Task not found'), null);
            }

            const self = this; // Store reference to Task class

            // Begin transaction
            db.serialize(() => {
                db.run('BEGIN TRANSACTION', (err) => {
                    if (err) {
                        return callback(err, null);
                    }

                    // If moving to a different column
                    if (columnId !== task.column_id) {
                        // Make space in the target column
                        db.run(
                            'UPDATE tasks SET position = position + 1 WHERE column_id = ? AND position >= ?',
                            [columnId, position],
                            err => {
                                if (err) {
                                    return db.run('ROLLBACK', () => callback(err, null));
                                }

                                // Update the task with new column and position
                                db.run(
                                    'UPDATE tasks SET column_id = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                                    [columnId, position, id],
                                    err => {
                                        if (err) {
                                            return db.run('ROLLBACK', () => callback(err, null));
                                        }

                                        // Reorder positions in the original column
                                        db.run(
                                            'UPDATE tasks SET position = position - 1 WHERE column_id = ? AND position > ?',
                                            [task.column_id, task.position],
                                            err => {
                                                if (err) {
                                                    return db.run('ROLLBACK', () => callback(err, null));
                                                }

                                                db.run('COMMIT', (err) => {
                                                    if (err) {
                                                        return callback(err, null);
                                                    }
                                                    self.getById(id, callback); // Use the stored reference
                                                });
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    } else {
                        // Moving within the same column
                        let query;
                        let params;

                        if (position > task.position) {
                            // Moving down
                            query = `
              UPDATE tasks 
              SET position = position - 1 
              WHERE column_id = ? AND position > ? AND position <= ?
            `;
                            params = [columnId, task.position, position];
                        } else {
                            // Moving up
                            query = `
              UPDATE tasks 
              SET position = position + 1 
              WHERE column_id = ? AND position >= ? AND position < ?
            `;
                            params = [columnId, position, task.position];
                        }

                        db.run(query, params, err => {
                            if (err) {
                                return db.run('ROLLBACK', () => callback(err, null));
                            }

                            // Update the task position
                            db.run(
                                'UPDATE tasks SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                                [position, id],
                                err => {
                                    if (err) {
                                        return db.run('ROLLBACK', () => callback(err, null));
                                    }

                                    db.run('COMMIT', (err) => {
                                        if (err) {
                                            return callback(err, null);
                                        }
                                        self.getById(id, callback); // Use the stored reference
                                    });
                                }
                            );
                        });
                    }
                });
            });
        });
    }
}

module.exports = Task; 