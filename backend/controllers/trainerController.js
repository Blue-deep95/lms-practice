const Course = require('../models/Course');
const Topic = require('../models/Topic');
const Enrollment = require('../models/Enrollment');

// @desc    Get dashboard metrics for a trainer
// @route   GET /api/trainer/metrics
// @access  Private/Trainer
const getTrainerMetrics = async (req, res) => {
  try {
    const trainerId = req.user._id;

    // Find all courses assigned to this trainer
    const courses = await Course.find({ trainerId });
    const courseIds = courses.map((c) => c._id);

    // Count total topics inside these courses
    const totalTopics = await Topic.countDocuments({ courseId: { $in: courseIds } });

    // Count unique students enrolled in these courses
    const studentIds = await Enrollment.distinct('studentId', { courseId: { $in: courseIds } });
    const totalStudents = studentIds.length;

    res.status(200).json({
      success: true,
      data: {
        totalCourses: courses.length,
        totalTopics,
        totalStudentsEnrolled: totalStudents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Get all students enrolled in a trainer's courses
// @route   GET /api/trainer/students
// @access  Private/Trainer
const getTrainerStudents = async (req, res) => {
  try {
    const trainerId = req.user._id;

    // Find all courses assigned to this trainer
    const courses = await Course.find({ trainerId });
    const courseIds = courses.map((c) => c._id);

    // Find all enrollments in these courses
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } })
      .populate('studentId', 'name username email status')
      .populate('courseId', 'title');

    // Group enrollments by student
    const studentMap = {};
    enrollments.forEach((en) => {
      if (!en.studentId) return;
      const sId = en.studentId._id.toString();

      if (!studentMap[sId]) {
        studentMap[sId] = {
          _id: en.studentId._id,
          name: en.studentId.name,
          username: en.studentId.username,
          email: en.studentId.email,
          status: en.studentId.status,
          courses: [],
        };
      }

      studentMap[sId].courses.push({
        _id: en.courseId._id,
        title: en.courseId.title,
        enrolledAt: en.enrolledAt,
      });
    });

    res.status(200).json({
      success: true,
      data: Object.values(studentMap),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTrainerMetrics,
  getTrainerStudents,
};
