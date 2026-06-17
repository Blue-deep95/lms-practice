const bcrypt = require('bcrypt');
const User = require('../models/User');
const Course = require('../models/Course');
const Topic = require('../models/Topic');

// helper function to generate unique username
const generateUniqueUsername = async (email) => {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  let username = base;
  let exists = await User.findOne({ username });
  while (exists) {
    username = `${base}${Math.floor(Math.random() * 1000)}`;
    exists = await User.findOne({ username });
  }
  return username;
};

// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
const getMetrics = async (req, res) => {
  try {
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments({});
    const totalTopics = await Topic.countDocuments({});

    res.status(200).json({
      success: true,
      data: {
        totalTrainers,
        totalStudents,
        totalCourses,
        totalTopics,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all trainers
// @route   GET /api/admin/trainers
// @access  Private/Admin
const getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a trainer
// @route   POST /api/admin/trainers
// @access  Private/Admin
const addTrainer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUniqueUsername(email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const trainer = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      role: 'trainer',
      status: 'active',
    });

    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    res.status(201).json({ success: true, data: trainerResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a trainer
// @route   PUT /api/admin/trainers/:id
// @access  Private/Admin
const updateTrainer = async (req, res) => {
  try {
    const { name, email } = req.body;
    const trainer = await User.findOne({ _id: req.params.id, role: 'trainer' });

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    if (email && email !== trainer.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      trainer.email = email;
    }

    if (name) trainer.name = name;

    await trainer.save();

    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    res.status(200).json({ success: true, data: trainerResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user status (activate/deactivate)
// @route   PUT /api/admin/trainers/:id/status
// @access  Private/Admin
const toggleTrainerStatus = async (req, res) => {
  try {
    const trainer = await User.findOne({ _id: req.params.id, role: 'trainer' });

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.status = trainer.status === 'active' ? 'inactive' : 'active';
    await trainer.save();

    res.status(200).json({ success: true, data: { id: trainer._id, status: trainer.status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a trainer
// @route   DELETE /api/admin/trainers/:id
// @access  Private/Admin
const deleteTrainer = async (req, res) => {
  try {
    const trainer = await User.findOneAndDelete({ _id: req.params.id, role: 'trainer' });

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    // Optionally disassociate trainer from courses
    await Course.updateMany({ trainerId: req.params.id }, { trainerId: null });

    res.status(200).json({ success: true, message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a student
// @route   POST /api/admin/students
// @access  Private/Admin
const addStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const username = await generateUniqueUsername(email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      role: 'student',
      status: 'active',
    });

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(201).json({ success: true, data: studentResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/admin/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await User.findOne({ _id: req.params.id, role: 'student' });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (email && email !== student.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      student.email = email;
    }

    if (name) student.name = name;

    await student.save();

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(200).json({ success: true, data: studentResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle student status
// @route   PUT /api/admin/students/:id/status
// @access  Private/Admin
const toggleStudentStatus = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.status = student.status === 'active' ? 'inactive' : 'active';
    await student.save();

    res.status(200).json({ success: true, data: { id: student._id, status: student.status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Clean up student enrollments
    const Enrollment = require('../models/Enrollment');
    await Enrollment.deleteMany({ studentId: req.params.id });

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
