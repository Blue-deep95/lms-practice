import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';

// Theme
import theme from './theme';

// Components
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/common/LandingPage';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import ForgotPassword from './pages/common/ForgotPassword';
import Profile from './pages/common/Profile';
import About from './pages/common/About';
import StudentDashboard from './pages/student/StudentDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import DashboardDispatcher from './pages/common/DashboardDispatcher';
import AdminOverview from './pages/admin/AdminOverview';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCourses from './pages/admin/AdminCourses';
import TrainerOverview from './pages/trainer/TrainerOverview';
import TrainerCourses from './pages/trainer/TrainerCourses';
import TrainerTopics from './pages/trainer/TrainerTopics';
import TrainerStudents from './pages/trainer/TrainerStudents';
import StudentOverview from './pages/student/StudentOverview';
import StudentCatalog from './pages/student/StudentCatalog';
import StudentCourses from './pages/student/StudentCourses';
import StudentLearn from './pages/student/StudentLearn';
import { AuthProvider } from './context/AuthContext';


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Shared Navbar at the top of all pages */}
            <Navbar />
            
            {/* Page Routing */}
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                
                {/* Unified Dashboard Nested Layout and Sub-Routes */}
                <Route path="/dashboard" element={<DashboardDispatcher />}>
                  {/* Admin dashboard nested layouts */}
                  <Route path="admin" element={<AdminDashboard />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="trainers" element={<AdminTrainers />} />
                    <Route path="students" element={<AdminStudents />} />
                    <Route path="courses" element={<AdminCourses />} />
                  </Route>
                  
                  {/* Trainer dashboard nested layouts */}
                  <Route path="trainer" element={<TrainerDashboard />}>
                    <Route index element={<TrainerOverview />} />
                    <Route path="courses" element={<TrainerCourses />} />
                    <Route path="courses/:courseId/topics" element={<TrainerTopics />} />
                    <Route path="students" element={<TrainerStudents />} />
                  </Route>
                  
                  {/* Student dashboard nested layouts */}
                  <Route path="student" element={<StudentDashboard />}>
                    <Route index element={<StudentOverview />} />
                    <Route path="catalog" element={<StudentCatalog />} />
                    <Route path="courses" element={<StudentCourses />} />
                    <Route path="courses/:courseId/learn" element={<StudentLearn />} />
                  </Route>
                </Route>
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}