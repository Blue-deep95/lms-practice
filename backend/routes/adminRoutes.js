const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
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
router.use(adminOnly);

// Metrics endpoint
router.get('/metrics', getMetrics);

// Trainers endpoints
router.route('/trainers')
  .get(getTrainers)
  .post(addTrainer);

router.route('/trainers/:id')
  .put(updateTrainer)
  .delete(deleteTrainer);

router.put('/trainers/:id/status', toggleTrainerStatus);

// Students endpoints
router.route('/students')
  .get(getStudents)
  .post(addStudent);

router.route('/students/:id')
  .put(updateStudent)
  .delete(deleteStudent);

router.put('/students/:id/status', toggleStudentStatus);

module.exports = router;
