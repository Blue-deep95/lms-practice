const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  reorderTopics,
} = require('../controllers/topicController');

router.use(protect);

router.get('/get-topics', getTopics);
router.post('/create-topic', authorizeRoles('trainer', 'admin'), createTopic);
router.put('/reorder-topics', authorizeRoles('trainer', 'admin'), reorderTopics);
router.put('/update-topic/:id', authorizeRoles('trainer', 'admin'), updateTopic);
router.delete('/delete-topic/:id', authorizeRoles('trainer', 'admin'), deleteTopic);

module.exports = router;
