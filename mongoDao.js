const mongoose = require('mongoose');

// Define Lecturer Schema and Model
const LecturerSchema = new mongoose.Schema({
    _id: String,
    name: String,
    did: String
});

const Lecturer = mongoose.model('Lecturer', LecturerSchema);

// Exports all methods
module.exports = {

    // Get all lecturers sorted by ID
    getAllLecturers: async () => {
        try {
            return await Lecturer.find().sort('_id');
        } catch (err) {
            throw new Error('Error retrieving lecturers: ' + err.message);
        }
    },

    // Delete a lecturer by ID
    deleteLecturerById: async (id) => {
        try {
            return await Lecturer.deleteOne({ _id: id });
        } catch (err) {
            throw new Error('Error deleting lecturer: ' + err.message);
        }
    }
    
};
