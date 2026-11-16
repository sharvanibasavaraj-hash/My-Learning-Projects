
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3011;

app.use(express.json());

// Read student records
function getStudents() {
    if (!fs.existsSync("students.json")) {
        fs.writeFileSync("students.json", "[]");
    }

    return JSON.parse(fs.readFileSync("students.json", "utf8"));
}

// Save student records
function saveStudents(students) {
    fs.writeFileSync("students.json", JSON.stringify(students, null, 2));
}

// 1. GET - View all students
app.get("/students", (req, res) => {
    const students = getStudents();
    res.status(200).json(students);
});

// 2. GET - View student by ID
app.get("/students/:id", (req, res) => {
    const students = getStudents();

    const student = students.find(
        s => s.id === Number(req.params.id)
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

// 3. POST - Add student
app.post("/students", (req, res) => {
    const { name, usn, department, year, email } = req.body;

    if (!name || !usn || !department || !year || !email) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const students = getStudents();

    const existingStudent = students.find(
        s => s.usn.toLowerCase() === usn.trim().toLowerCase()
    );

    if (existingStudent) {
        return res.status(409).json({
            message: "USN already exists"
        });
    }

    const newStudent = {
        id: Date.now(),
        name: name.trim(),
        usn: usn.trim(),
        department: department.trim(),
        year,
        email: email.trim()
    };

    students.push(newStudent);
    saveStudents(students);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

// 4. PUT - Update student
app.put("/students/:id", (req, res) => {
    const students = getStudents();

    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, usn, department, year, email } = req.body;

    if (!name || !usn || !department || !year || !email) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const duplicate = students.find(
        s => s.usn.toLowerCase() === usn.trim().toLowerCase() && s.id !== id
    );

    if (duplicate) {
        return res.status(409).json({
            message: "USN already exists"
        });
    }

    students[index] = {
        id,
        name: name.trim(),
        usn: usn.trim(),
        department: department.trim(),
        year,
        email: email.trim()
    };

    saveStudents(students);

    res.status(200).json({
        message: "Student updated successfully",
        student: students[index]
    });
});

// 5. DELETE - Delete student
app.delete("/students/:id", (req, res) => {
    const students = getStudents();

    const id = Number(req.params.id);

    const filteredStudents = students.filter(
        s => s.id !== id
    );

    if (filteredStudents.length === students.length) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    saveStudents(filteredStudents);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
