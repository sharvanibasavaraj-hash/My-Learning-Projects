
const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3012;

app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your sql password",
    database: "student_db"
});

connection.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL successfully!");
});

// 1. GET - View all students
app.get("/students", (req, res) => {
    connection.query("SELECT * FROM students", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json(results);
    });
});

// 2. GET - View student by ID
app.get("/students/:id", (req, res) => {
    connection.query(
        "SELECT * FROM students WHERE id = ?",
        [req.params.id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Student not found" });
            }

            res.status(200).json(results[0]);
        }
    );
});

// 3. POST - Add a student
app.post("/students", (req, res) => {
    const { name, usn, department, year, email } = req.body;

    if (!name || !usn || !department || !year || !email) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO students (name, usn, department, year, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [name, usn, department, year, email],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "USN already exists"
                    });
                }

                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Student added successfully",
                studentId: result.insertId
            });
        }
    );
});

// 4. PUT - Update a student
app.put("/students/:id", (req, res) => {
    const { name, usn, department, year, email } = req.body;

    if (!name || !usn || !department || !year || !email) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        UPDATE students
        SET name = ?, usn = ?, department = ?, year = ?, email = ?
        WHERE id = ?
    `;

    connection.query(
        sql,
        [name, usn, department, year, email, req.params.id],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "USN already exists"
                    });
                }

                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            res.status(200).json({
                message: "Student updated successfully"
            });
        }
    );
});

// 5. DELETE - Delete a student
app.delete("/students/:id", (req, res) => {
    connection.query(
        "DELETE FROM students WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            res.status(200).json({
                message: "Student deleted successfully"
            });
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
