const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getTrainerMetrics, getTrainerStudents } = require('../controllers/trainerController');

router.use(protect);
router.use(authorizeRoles('trainer', 'admin'));

router.get('/get-metrics', getTrainerMetrics);
router.get('/get-students', getTrainerStudents);

module.exports = router;
