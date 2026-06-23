const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const addStudents = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      console.error('Error: MONGODB_URL is not defined in backend/.env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB successfully!');

    const passwordPlain = '12345';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordPlain, salt);

    const studentsToCreate = [
      {
        username: 's1',
        name: 'Student One',
        email: 's1@lms.com',
        password: hashedPassword,
        role: 'student',
        status: 'active'
      },
      {
        username: 's2',
        name: 'Student Two',
        email: 's2@lms.com',
        password: hashedPassword,
        role: 'student',
        status: 'active'
      },
      {
        username: 's3',
        name: 'Student Three',
        email: 's3@lms.com',
        password: hashedPassword,
        role: 'student',
        status: 'active'
      }
    ];

    for (const student of studentsToCreate) {
      // Delete existing student with the same username or email to avoid duplicate keys
      await User.deleteMany({
        $or: [{ username: student.username }, { email: student.email }]
      });
      console.log(`Cleared existing records for username/email: ${student.username}`);

      const newUser = new User(student);
      await newUser.save();
      console.log(`Successfully created student: ${student.username} (Email: ${student.email})`);
    }

    console.log('All 3 students added successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding students:', error);
    process.exit(1);
  }
};

addStudents();
