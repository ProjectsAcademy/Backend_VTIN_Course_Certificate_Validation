const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  stu_id: {
    type: String,
    required: true,
    unique: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  certificateLink: {
    type: String,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
