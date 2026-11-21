// Student Management System

let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};
let performanceChart = null;

const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const addStudentBtn = document.getElementById("addStudentBtn");

// Save students
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Display students
function displayStudents(data = students) {
    studentTable.innerHTML = "";

    data.forEach((student, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.marks}%</td>
            <td>${getGrade(student.marks)}</td>
            <td>
                <button onclick="editStudent(${index})">Edit</button>
                <button onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;

        studentTable.appendChild(row);
    });

    updateDashboard();
    displayResults();
}

// Calculate grade
function getGrade(marks) {
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
}

// Add student
function addStudent() {
    const name = prompt("Enter student name:");
    if (!name || !name.trim()) return;

    const email = prompt("Enter student email:");
    if (!email || !email.trim()) return;

    const course = prompt("Enter course name:");
    if (!course || !course.trim()) return;

    const marksInput = prompt("Enter marks (0-100):");
    if (marksInput === null || marksInput.trim() === "") return;

    const marks = Number(marksInput);

    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
        alert("Please enter valid marks between 0 and 100.");
        return;
    }

    const student = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        course: course.trim(),
        marks: marks
    };

    students.push(student);

    saveStudents();
    displayStudents();

    alert("Student added successfully!");
}

// Edit student
function editStudent(index) {
    const student = students[index];
    if (!student) return;

    const name = prompt("Update student name:", student.name);
    if (name === null || !name.trim()) return;

    const email = prompt("Update email:", student.email);
    if (email === null || !email.trim()) return;

    const course = prompt("Update course:", student.course);
    if (course === null || !course.trim()) return;

    const marksInput = prompt("Update marks (0-100):", student.marks);
    if (marksInput === null || marksInput.trim() === "") return;

    const marks = Number(marksInput);

    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
        alert("Please enter valid marks between 0 and 100.");
        return;
    }

    student.name = name.trim();
    student.email = email.trim();
    student.course = course.trim();
    student.marks = marks;

    saveStudents();
    displayStudents();

    alert("Student updated successfully!");
}

// Delete student
function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        saveStudents();
        displayStudents();
    }
}

// Search students
searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue) ||
        student.course.toLowerCase().includes(searchValue)
    );

    displayStudents(filteredStudents);
});

// Update dashboard statistics
function updateDashboard() {
    document.getElementById("totalStudents").textContent = students.length;

    const average = students.length
        ? students.reduce((sum, student) => sum + student.marks, 0) / students.length
        : 0;

    document.getElementById("averageMarks").textContent =
        average.toFixed(1) + "%";

    document.getElementById("topGrades").textContent =
        students.filter(student => student.marks >= 80).length;
        document.getElementById("presentStudents").textContent =
    students.filter(student =>
        attendance[student.id] === "Present"
    ).length
    displayPerformanceChart();
}

// Button event
addStudentBtn.addEventListener("click", addStudent);

// Initial display
displayStudents();

// Attendance Management



function displayAttendance() {
    const attendanceTable = document.getElementById("attendanceTable");
    attendanceTable.innerHTML = "";

    students.forEach(student => {
        const status = attendance[student.id] || "Not Marked";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>
                <button onclick="markAttendance(${student.id}, 'Present')">
                    Present
                </button>

                <button onclick="markAttendance(${student.id}, 'Absent')">
                    Absent
                </button>

                <span>${status}</span>
            </td>
        `;

        attendanceTable.appendChild(row);
    });
}

function markAttendance(id, status) {
    attendance[id] = status;

    localStorage.setItem("attendance", JSON.stringify(attendance));

    displayAttendance();
}

displayAttendance();
updateDashboard();

// Results Management

function displayResults() {
    const resultsTable = document.getElementById("resultsTable");

    resultsTable.innerHTML = "";

    students.forEach(student => {
        const grade = getGrade(student.marks);

        let performance = "Needs Improvement";

        if (student.marks >= 80) {
            performance = "Excellent";
        } else if (student.marks >= 60) {
            performance = "Good";
        } else if (student.marks >= 50) {
            performance = "Average";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.marks}%</td>
            <td>${grade}</td>
            <td>${performance}</td>
        `;

        resultsTable.appendChild(row);
    });
}

displayResults();

// Student Performance Chart



function displayPerformanceChart() {
    const canvas = document.getElementById("performanceChart");

    if (!canvas || typeof Chart === "undefined") return;

    const names = students.map(student => student.name);
    const marks = students.map(student => student.marks);

    if (performanceChart) {
        performanceChart.destroy();
    }

    performanceChart = new Chart(canvas, {
        type: "bar",

        data: {
            labels: names,

            datasets: [{
                label: "Student Marks (%)",
                data: marks,
                backgroundColor: "#635bdb",
                borderRadius: 7
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

displayPerformanceChart();
updateDashboard();