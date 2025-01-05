const mysql = require('mysql2');

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'root', // Replace with your MySQL password
    database: 'proj2024Mysql' // Replace with your MySQL database name
});

const promisePool = pool.promise();

// Exports all methods
module.exports = {
    // Fetch all students
    getAllStudents: async () => {
        const [rows] = await promisePool.query('SELECT * FROM student ORDER BY sid');
        return rows;
    },

    // Fetch a single student by ID
    getStudentById: async (sid) => {
        const [rows] = await promisePool.query('SELECT * FROM student WHERE sid = ?', [sid]);
        return rows[0];
    },

    // Add a new student
    addStudent: async (student) => {
        const { sid, name, age } = student;
        await promisePool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', [sid, name, age]);
    },

    // Update student details
    updateStudent: async (sid, student) => {
        const { name, age } = student;
        await promisePool.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', [name, age, sid]);
    },

    // Fetch all grades
    getAllGrades: async () => {
        const [rows] = await promisePool.query(
            `SELECT student.name AS studentName, module.name AS moduleName, grade.grade
             FROM student
             LEFT JOIN grade ON student.sid = grade.sid
             LEFT JOIN module ON grade.mid = module.mid
             ORDER BY student.name, grade.grade`
        );
        return rows;
    },

    // Check modules by lecturer ID
    getModulesByLecturer: async (lecturerId) => {
        const [rows] = await promisePool.query('SELECT * FROM module WHERE lecturer = ?', [lecturerId]);
        return rows;
    }
};
