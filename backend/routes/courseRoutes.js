const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  assignTrainer,
} = require('../controllers/courseController');

// All routes require authentication
router.use(protect);

router.get('/get-courses', getCourses);
router.post('/create-course', authorizeRoles('trainer', 'admin'), createCourse);
router.put('/update-course/:id', authorizeRoles('trainer', 'admin'), updateCourse);
router.delete('/delete-course/:id', authorizeRoles('trainer', 'admin'), deleteCourse);
router.put('/assign-trainer/:id', authorizeRoles('admin'), assignTrainer);

module.exports = router;
