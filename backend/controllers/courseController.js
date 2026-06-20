const Course = require('../models/Course');
const Topic = require('../models/Topic');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    let courses;

    if (req.user.role === 'trainer') {
      // Trainers see courses they own or are assigned to
      courses = await Course.find({ trainerId: req.user._id })
        .populate('trainerId', 'name username email')
        .sort({ createdAt: -1 });
    } else {
      // Admins and Students (when enabled) see all courses
      courses = await Course.find({})
        .populate('trainerId', 'name username email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin & Trainer)
const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, category, trainerId } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Please provide course title and description' });
    }

    // Set trainerId. If admin, can optionally assign trainerId. If trainer, it is self.
    let assignedTrainerId = null;
    if (req.user.role === 'trainer') {
      assignedTrainerId = req.user._id;
    } else if (req.user.role === 'admin' && trainerId) {
      assignedTrainerId = trainerId;
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      category,
      trainerId: assignedTrainerId,
    });

    const populatedCourse = await Course.findById(course._id).populate('trainerId', 'name username email');

    res.status(201).json({ success: true, data: populatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin & Trainer)
const updateCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, category, trainerId } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Authorization check: Trainers can only edit their own courses
    if (req.user.role === 'trainer' && course.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this course' });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (category !== undefined) course.category = category;

    // Only Admin can reassign trainers
    if (req.user.role === 'admin' && trainerId !== undefined) {
      course.trainerId = trainerId || null;
    }

    await course.save();

    const populatedCourse = await Course.findById(course._id).populate('trainerId', 'name username email');

    res.status(200).json({ success: true, data: populatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin & Trainer)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Authorization check
    if (req.user.role === 'trainer' && course.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);

    // Delete associated topics
    await Topic.deleteMany({ courseId: req.params.id });

    // Clean up student enrollments
    const Enrollment = require('../models/Enrollment');
    await Enrollment.deleteMany({ courseId: req.params.id });

    res.status(200).json({ success: true, message: 'Course and related topics deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign trainer to course
// @route   PUT /api/courses/:id/assign
// @access  Private/Admin
const assignTrainer = async (req, res) => {
  try {
    const { trainerId } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (trainerId) {
      const trainer = await User.findOne({ _id: trainerId, role: 'trainer' });
      if (!trainer) {
        return res.status(404).json({ success: false, message: 'Trainer not found' });
      }
      course.trainerId = trainerId;
    } else {
      course.trainerId = null;
    }

    await course.save();

    const populatedCourse = await Course.findById(course._id).populate('trainerId', 'name username email');

    res.status(200).json({ success: true, data: populatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  assignTrainer,
};
