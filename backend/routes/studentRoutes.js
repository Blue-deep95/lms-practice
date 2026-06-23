const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getStudentMetrics,
  getEnrollments,
  enrollInCourse,
  getRecentlyAddedCourses,
} = require('../controllers/studentController');

// All student routes require authentication and student role authorization
router.use(protect);
router.use(authorizeRoles('student'));

router.get('/metrics', getStudentMetrics);
router.get('/enrollments', getEnrollments);
router.post('/enroll', enrollInCourse);
router.get('/recently-added', getRecentlyAddedCourses);

module.exports = router;
