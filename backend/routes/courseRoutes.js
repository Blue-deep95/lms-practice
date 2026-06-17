const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  assignTrainer,
} = require('../controllers/courseController');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getCourses)
  .post(createCourse);

router.route('/:id')
  .put(updateCourse)
  .delete(deleteCourse);

router.put('/:id/assign', assignTrainer);

module.exports = router;
