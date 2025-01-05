// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const {getAllStudents, getAllGrades, getStudentById, updateStudent, addStudent, getModulesByLecturer} = require("./mySqlDao");// Functions for interacting with the MySQL database
const {getAllLecturers, deleteLecturerById} = require("./mongoDao");// Functions for interacting with the MongoDB database
const mongoose = require('mongoose');
const path = require('path');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/proj2024MongoDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Initialize Express app
const app = express();
const PORT = 3004;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Example using EJS for templates

// Routes
// Render the home page with navigation links
app.get('/', (req, res) => {
    res.render('home', {
        links: [
            { url: '/students', name: 'Students Page' },
            { url: '/grades', name: 'Grades Page' },
            { url: '/lecturers', name: 'Lecturers Page' }
        ]
    });
});

// Render a list of students
app.get('/students', async (req, res) => {
    try {
        const students = await getAllStudents();
        res.render('students', { students });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Render the edit students form
app.get('/students/edit/:sid', async (req, res) => {
    try {
        const student = await getStudentById(req.params.sid);
        res.render('edit_student', { student });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update the student details in the database
app.post('/students/edit/:sid', async (req, res) => {
    try {
        const { name, age } = req.body;
        if (name.length < 2 || age < 18) {
            return res.status(400).send('Validation error: Name must be at least 2 characters and age 18+.');
        }
        await updateStudent(req.params.sid, { name, age });
        res.redirect('/students');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add a new student
app.get('/students/add', async (req, res) => {
        res.render("add_student");
});

// Push new student to data base
app.post('/students/add', async (req, res) => {
    try {
        const { sid, name, age } = req.body;
        await addStudent({ sid, name, age });
        res.redirect('/students');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get and render list of grades
app.get('/grades', (req, res) => {
    getAllGrades()
        .then(grades => res.render('grades', { grades }))
        .catch(err => res.status(500).send('Error retrieving grades.'));
});

// Get and render list of lecturers
app.get('/lecturers', async (req, res) => {
    try {
        const lecturers = await getAllLecturers();
        res.render('lecturers', { lecturers });
    } catch (err) {
        res.status(500).send('Error retrieving lecturers.');
    }
});

// Delete a lecturer
app.get('/lecturers/delete/:lid', async (req, res) => {
    const lid = req.params.lid;

    try {
        const modules = await getModulesByLecturer(lid); // Ensure no linked modules
        if (modules.length > 0) {
            return res.status(400).send('Cannot delete lecturer teaching modules.');
        }

        await deleteLecturerById(lid); // Delete Lecturer
        res.redirect('/lecturers');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
