const fs = require("fs");
const readline = require("readline");

const FILE = "students.json";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getStudents() {
    if (!fs.existsSync(FILE)) {
        return [];
    }

    return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveStudents(students) {
    fs.writeFileSync(FILE, JSON.stringify(students, null, 2));
}

function addStudent() {
    rl.question("Enter student ID: ", (id) => {
        rl.question("Enter student name: ", (name) => {
            rl.question("Enter department: ", (department) => {

                const students = getStudents();

                if (students.some(s => s.id === id)) {
                    console.log("Student ID already exists");
                } else {
                    students.push({
                        id,
                        name,
                        department
                    });

                    saveStudents(students);
                    console.log("Student added successfully");
                }

                menu();
            });
        });
    });
}

function viewStudents() {
    const students = getStudents();

    if (students.length === 0) {
        console.log("No student records found");
    } else {
        console.log("\nStudent Records:");
        console.table(students);
    }

    menu();
}

function searchStudent() {
    rl.question("Enter student ID: ", (id) => {
        const students = getStudents();
        const student = students.find(s => s.id === id);

        if (student) {
            console.table([student]);
        } else {
            console.log("Student not found");
        }

        menu();
    });
}

function updateStudent() {
    rl.question("Enter student ID to update: ", (id) => {
        const students = getStudents();
        const student = students.find(s => s.id === id);

        if (!student) {
            console.log("Student not found");
            return menu();
        }

        rl.question("Enter new name: ", (name) => {
            rl.question("Enter new department: ", (department) => {

                student.name = name;
                student.department = department;

                saveStudents(students);

                console.log("Student updated successfully");
                menu();
            });
        });
    });
}

function deleteStudent() {
    rl.question("Enter student ID to delete: ", (id) => {
        let students = getStudents();

        const updatedStudents = students.filter(s => s.id !== id);

        if (students.length === updatedStudents.length) {
            console.log("Student not found");
        } else {
            saveStudents(updatedStudents);
            console.log("Student deleted successfully");
        }

        menu();
    });
}

function menu() {
    console.log("\n===== STUDENT RECORD MANAGER =====");
    console.log("1. Add Student");
    console.log("2. View Students");
    console.log("3. Search Student");
    console.log("4. Update Student");
    console.log("5. Delete Student");
    console.log("6. Exit");

    rl.question("Choose an option: ", (choice) => {
        switch (choice) {
            case "1":
                addStudent();
                break;
            case "2":
                viewStudents();
                break;
            case "3":
                searchStudent();
                break;
            case "4":
                updateStudent();
                break;
            case "5":
                deleteStudent();
                break;
            case "6":
                rl.close();
                break;
            default:
                console.log("Invalid choice");
                menu();
        }
    });
}

menu();