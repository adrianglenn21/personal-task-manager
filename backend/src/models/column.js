const db = require('../db/database');
const Task = require('./task');

class Column {
    // Get all columns with tasks
    static getAllWithTasks(callback) {
        const sql = `
      SELECT * FROM columns
      ORDER BY position
    `;

        db.all(sql, [], (err, columns) => {
            if (err) {
                return callback(err, null);
            }

            // If no columns found, return empty array
            if (columns.length === 0) {
                return callback(null, []);
            }

            // Get tasks for each column
            let completedColumns = 0;
            const columnsWithTasks = [];

            columns.forEach(column => {
                Task.getByColumn(column.id, (err, tasks) => {
                    if (err) {
                        return callback(err, null);
                    }

                    columnsWithTasks.push({
                        ...column,
                        tasks: tasks || []
                    });

                    completedColumns++;
                    if (completedColumns === columns.length) {
                        // Sort columns by position
                        columnsWithTasks.sort((a, b) => a.position - b.position);
                        callback(null, columnsWithTasks);
                    }
                });
            });
        });
    }

    // Get a column by ID with tasks
    static getById(id, callback) {
        const sql = 'SELECT * FROM columns WHERE id = ?';

        db.get(sql, [id], (err, column) => {
            if (err) {
                return callback(err, null);
            }

            if (!column) {
                return callback(null, null);
            }

            // Get tasks for this column
            Task.getByColumn(column.id, (err, tasks) => {
                if (err) {
                    return callback(err, null);
                }

                const columnWithTasks = {
                    ...column,
                    tasks: tasks || []
                };

                callback(null, columnWithTasks);
            });
        });
    }

    // Create a new column
    static create(columnData, callback) {
        // First, calculate the position for the new column
        const positionSql = 'SELECT COALESCE(MAX(position), 0) + 1 as new_position FROM columns';

        db.get(positionSql, [], (err, positionRow) => {
            if (err) {
                return callback(err, null);
            }

            const position = positionRow.new_position;

            // Insert the column
            const insertSql = 'INSERT INTO columns (id, title, position) VALUES (?, ?, ?)';

            db.run(insertSql, [columnData.id, columnData.title, position], function (err) {
                if (err) {
                    return callback(err, null);
                }

                // Get the created column with tasks (there won't be any tasks yet)
                Column.getById(columnData.id, callback);
            });
        });
    }

    // Update a column
    static update(id, columnData, callback) {
        const updateSql = 'UPDATE columns SET title = ? WHERE id = ?';

        db.run(updateSql, [columnData.title, id], function (err) {
            if (err) {
                return callback(err, null);
            }

            if (this.changes === 0) {
                return callback(new Error('Column not found'), null);
            }

            // Get the updated column with tasks
            Column.getById(id, callback);
        });
    }

    // Delete a column
    static delete(id, callback) {
        // Begin transaction
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // Get all tasks in the column
            Task.getByColumn(id, (err, tasks) => {
                if (err) {
                    db.run('ROLLBACK');
                    return callback(err);
                }

                // Delete all tasks in the column
                if (tasks && tasks.length > 0) {
                    const taskIds = tasks.map(task => task.id);

                    // Delete all relations for these tasks
                    db.run('DELETE FROM task_tags WHERE task_id IN (' + taskIds.join(',') + ')', err => {
                        if (err) {
                            db.run('ROLLBACK');
                            return callback(err);
                        }

                        db.run('DELETE FROM task_assignees WHERE task_id IN (' + taskIds.join(',') + ')', err => {
                            if (err) {
                                db.run('ROLLBACK');
                                return callback(err);
                            }

                            // Delete all tasks in this column
                            db.run('DELETE FROM tasks WHERE column_id = ?', [id], err => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return callback(err);
                                }

                                // Now delete the column
                                deleteColumnAndFinish();
                            });
                        });
                    });
                } else {
                    // No tasks to delete, just delete the column
                    deleteColumnAndFinish();
                }

                function deleteColumnAndFinish() {
                    db.run('DELETE FROM columns WHERE id = ?', [id], function (err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return callback(err);
                        }

                        if (this.changes === 0) {
                            db.run('ROLLBACK');
                            return callback(new Error('Column not found'));
                        }

                        // Update positions of remaining columns
                        db.run('UPDATE columns SET position = position - 1 WHERE position > (SELECT position FROM columns WHERE id = ?)', [id], err => {
                            if (err) {
                                db.run('ROLLBACK');
                                return callback(err);
                            }

                            db.run('COMMIT');
                            callback(null);
                        });
                    });
                }
            });
        });
    }

    // Reorder columns
    static reorder(columnIds, callback) {
        if (!columnIds || !Array.isArray(columnIds) || columnIds.length === 0) {
            return callback(new Error('Invalid column IDs array'));
        }

        // Begin transaction
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            let updatedCount = 0;
            const totalToUpdate = columnIds.length;

            // Update each column's position
            columnIds.forEach((columnId, index) => {
                const position = index + 1;

                db.run('UPDATE columns SET position = ? WHERE id = ?', [position, columnId], function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return callback(err);
                    }

                    updatedCount++;

                    if (updatedCount === totalToUpdate) {
                        db.run('COMMIT');
                        callback(null);
                    }
                });
            });
        });
    }
}

module.exports = Column; 