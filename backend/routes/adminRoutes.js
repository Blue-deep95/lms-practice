const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getMetrics,
  getTrainers,
  addTrainer,
  updateTrainer,
  toggleTrainerStatus,
  deleteTrainer,
  getStudents,
  addStudent,
  updateStudent,
  toggleStudentStatus,
  deleteStudent,
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles('admin'));

// Metrics endpoint
router.get('/get-metrics', getMetrics);

// Trainers endpoints
router.get('/get-trainers', getTrainers);
router.post('/add-trainer', addTrainer);
router.put('/update-trainer/:id', updateTrainer);
router.delete('/delete-trainer/:id', deleteTrainer);
router.put('/toggle-trainer-status/:id', toggleTrainerStatus);

// Students endpoints
router.get('/get-students', getStudents);
router.post('/add-student', addStudent);
router.put('/update-student/:id', updateStudent);
router.delete('/delete-student/:id', deleteStudent);
router.put('/toggle-student-status/:id', toggleStudentStatus);

module.exports = router;
