const db = require('../db/database');

class User {
    // Get all users
    static getAll(callback) {
        const sql = 'SELECT * FROM users';

        db.all(sql, [], (err, users) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, users);
        });
    }

    // Get user by ID
    static getById(id, callback) {
        const sql = 'SELECT * FROM users WHERE id = ?';

        db.get(sql, [id], (err, user) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, user);
        });
    }

    // Create a new user
    static create(userData, callback) {
        const sql = 'INSERT INTO users (name, email, avatar) VALUES (?, ?, ?)';

        db.run(sql, [userData.name, userData.email, userData.avatar || null], function (err) {
            if (err) {
                return callback(err, null);
            }

            User.getById(this.lastID, callback);
        });
    }

    // Update a user
    static update(id, userData, callback) {
        const sql = 'UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?';

        db.run(sql, [userData.name, userData.email, userData.avatar || null, id], function (err) {
            if (err) {
                return callback(err, null);
            }

            if (this.changes === 0) {
                return callback(new Error('User not found'), null);
            }

            User.getById(id, callback);
        });
    }

    // Delete a user
    static delete(id, callback) {
        // Begin transaction
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // Remove user from task assignments
            db.run('DELETE FROM task_assignees WHERE user_id = ?', [id], err => {
                if (err) {
                    db.run('ROLLBACK');
                    return callback(err);
                }

                // Delete the user
                db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return callback(err);
                    }

                    if (this.changes === 0) {
                        db.run('ROLLBACK');
                        return callback(new Error('User not found'));
                    }

                    db.run('COMMIT');
                    callback(null);
                });
            });
        });
    }

    // Get users assigned to a task
    static getByTaskId(taskId, callback) {
        const sql = `
      SELECT u.*
      FROM users u
      JOIN task_assignees ta ON u.id = ta.user_id
      WHERE ta.task_id = ?
    `;

        db.all(sql, [taskId], (err, users) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, users);
        });
    }
}

module.exports = User; 