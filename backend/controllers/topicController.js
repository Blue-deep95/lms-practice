const Topic = require('../models/Topic');
const Course = require('../models/Course');

// @desc    Get all topics for a course
// @route   GET /api/topics
// @access  Private
const getTopics = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Please provide courseId' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Get topics sorted by order asc
    const topics = await Topic.find({ courseId }).sort({ order: 1 });

    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a topic inside a course
// @route   POST /api/topics
// @access  Private (Admin & Trainer)
const createTopic = async (req, res) => {
  try {
    const { courseId, title, description, videoUrl } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ success: false, message: 'Please provide courseId and topic title' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Authorization: Admin can create anywhere, Trainer can only create in their own courses
    if (req.user.role === 'trainer' && course.trainerId && course.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add topics to this course' });
    }



    // Find next order number
    const lastTopic = await Topic.findOne({ courseId }).sort({ order: -1 });
    const order = lastTopic ? lastTopic.order + 1 : 0;

    const topic = await Topic.create({
      courseId,
      title,
      description,
      videoUrl,
      order,
    });

    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private (Admin & Trainer)
const updateTopic = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;

    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const course = await Course.findById(topic.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found for this topic' });
    }

    // Authorization
    if (req.user.role === 'trainer' && course.trainerId && course.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit topics in this course' });
    }



    if (title) topic.title = title;
    if (description !== undefined) topic.description = description;
    if (videoUrl !== undefined) topic.videoUrl = videoUrl;

    await topic.save();

    res.status(200).json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private (Admin & Trainer)
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const course = await Course.findById(topic.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found for this topic' });
    }

    // Authorization
    if (req.user.role === 'trainer' && course.trainerId && course.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete topics in this course' });
    }



    await Topic.findByIdAndDelete(req.params.id);

    // Reorder remaining topics for the course
    const remainingTopics = await Topic.find({ courseId: topic.courseId }).sort({ order: 1 });
    for (let i = 0; i < remainingTopics.length; i++) {
      remainingTopics[i].order = i;
      await remainingTopics[i].save();
    }

    res.status(200).json({ success: true, message: 'Topic deleted and list reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reorder topics inside a course
// @route   PUT /api/topics/reorder
// @access  Private (Admin & Trainer)
const reorderTopics = async (req, res) => {
  try {
    const { courseId, topicIds } = req.body;

    if (!courseId || !topicIds || !Array.isArray(topicIds)) {
      return res.status(400).json({ success: false, message: 'Please provide courseId and topicIds array' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Authorization
    if (req.user.role === 'trainer' && course.trainerId && course.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reorder topics in this course' });
    }



    // Update each topic's order based on its position in the array
    for (let i = 0; i < topicIds.length; i++) {
      await Topic.updateOne({ _id: topicIds[i], courseId }, { order: i });
    }

    // Fetch and return updated list
    const topics = await Topic.find({ courseId }).sort({ order: 1 });

    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  reorderTopics,
};
