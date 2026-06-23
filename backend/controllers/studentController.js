const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get student metrics
// @route   GET /api/student/metrics
// @access  Private (Student)
const getStudentMetrics = async (req, res) => {
  try {
    const studentId = req.user._id;
    const totalEnrolledCourses = await Enrollment.countDocuments({ studentId });
    res.status(200).json({ success: true, data: { totalEnrolledCourses } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get enrolled courses for student
// @route   GET /api/student/enrollments
// @access  Private (Student)
const getEnrollments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ studentId })
      .populate({
        path: 'courseId',
        populate: {
          path: 'trainerId',
          select: 'name username email'
        }
      })
      .sort({ enrolledAt: -1 });

    const courses = enrollments
      .filter((e) => e.courseId)
      .map((e) => ({
        ...e.courseId.toObject(),
        enrolledAt: e.enrolledAt,
        enrollmentId: e._id,
      }));

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enroll student in a course
// @route   POST /api/student/enroll
// @access  Private (Student)
const enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Please provide courseId' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recently added courses student is not enrolled in
// @route   GET /api/student/recently-added
// @access  Private (Student)
const getRecentlyAddedCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrolledCourseIds = await Enrollment.distinct('courseId', { studentId });

    const courses = await Course.find({ _id: { $nin: enrolledCourseIds } })
      .populate('trainerId', 'name username email')
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudentMetrics,
  getEnrollments,
  enrollInCourse,
  getRecentlyAddedCourses,
};
