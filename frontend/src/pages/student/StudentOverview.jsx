import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import ExploreIcon from '@mui/icons-material/Explore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useAuth } from '../../context/AuthContext';
import useCustomFetch from '../../hooks/useCustomFetch';
import API from '../../api/api';

export default function StudentOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollLoadingId, setEnrollLoadingId] = useState(null);

  // Fetch metrics, enrolled courses, and new course recommendations
  const { data: metrics, loading: metricsLoading, refetch: refetchMetrics } = useCustomFetch('/student/metrics');
  const { data: enrollments, loading: enrollmentsLoading, refetch: refetchEnrollments } = useCustomFetch('/student/enrollments');
  const { data: recentlyAdded, loading: recentLoading, refetch: refetchRecently } = useCustomFetch('/student/recently-added');

  const handleEnroll = async (courseId) => {
    setEnrollLoadingId(courseId);
    try {
      const response = await API.post('/student/enroll', { courseId });
      if (response.data.success) {
        alert('Enrolled in course successfully! Redirecting to course details...');
        refetchMetrics();
        refetchEnrollments();
        refetchRecently();
        navigate(`/dashboard/student/courses/${courseId}/learn`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrollLoadingId(null);
    }
  };

  const isLoading = metricsLoading || enrollmentsLoading || recentLoading;

  if (isLoading && !enrollments && !recentlyAdded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const enrolledCount = metrics?.totalEnrolledCourses || 0;
  const recentEnrolled = enrollments?.slice(0, 3) || [];
  const discoverCourses = recentlyAdded || [];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Panel */}
      <Box sx={{ mb: 6, textAlign: 'left' }}>
        <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
          Welcome back, {user?.username}!
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          Track your progress, resume studying, or explore new subjects to build your skillset.
        </Typography>
      </Box>

      {/* Metric Cards Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              bgcolor: '#fafafc',
              border: '1px solid #dadce0',
              borderRadius: '24px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 20px -7px',
              },
            }}
          >
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#666666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Enrolled Courses
                </Typography>
                <Box sx={{ p: 1, bgcolor: '#f0f0f2', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ color: '#0085e4' }} />
                </Box>
              </Box>
              <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, letterSpacing: '-1px' }}>
                {enrolledCount}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666666' }}>
                Programs you are actively studying
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Sections */}
      <Grid container spacing={5}>
        {/* Left Column: Enrolled Courses */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ color: '#161637', fontWeight: 700, letterSpacing: '-0.4px' }}>
              My Recent Courses
            </Typography>
            {enrolledCount > 0 && (
              <Button
                component={Link}
                to="/dashboard/student/courses"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                View All
              </Button>
            )}
          </Box>

          {recentEnrolled.length === 0 ? (
            <Alert
              severity="info"
              sx={{ borderRadius: '16px', border: '1px solid #dadce0', bgcolor: '#f4f6fa', color: '#161637' }}
              action={
                <Button component={Link} to="/dashboard/student/catalog" color="primary" size="small" variant="contained">
                  Explore Catalog
                </Button>
              }
            >
              You haven't enrolled in any courses yet. Explore our catalog to start learning!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {recentEnrolled.map((course) => (
                <Grid size={{ xs: 12 }} key={course._id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid #dadce0',
                      borderRadius: '16px',
                      bgcolor: '#fafafc',
                      transition: 'border-color 0.2s',
                      '&:hover': { borderColor: '#161637' },
                    }}
                  >
                    <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'left' }}>
                        <Chip
                          label={course.category || 'General'}
                          size="small"
                          sx={{
                            bgcolor: '#f0f0f2',
                            color: '#161637',
                            fontWeight: 600,
                            borderRadius: '6px',
                            mb: 1,
                            fontSize: '11px',
                          }}
                        />
                        <Typography variant="h6" sx={{ color: '#161637', fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
                          {course.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666666' }}>
                          Instructor: {course.trainerId?.username || 'Unassigned'}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => navigate(`/dashboard/student/courses/${course._id}/learn`)}
                        sx={{ borderRadius: '8px', px: 2, py: 1, whiteSpace: 'nowrap' }}
                      >
                        Resume
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Right Column: Discover New Courses */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ color: '#161637', fontWeight: 700, letterSpacing: '-0.4px' }}>
              Explore New Courses
            </Typography>
            <Button
              component={Link}
              to="/dashboard/student/catalog"
              size="small"
              endIcon={<ExploreIcon fontSize="small" />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Browse
            </Button>
          </Box>

          {discoverCourses.length === 0 ? (
            <Alert severity="success" sx={{ borderRadius: '16px' }}>
              You are enrolled in all courses! Keep up the good work.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {discoverCourses.map((course) => (
                <Grid size={{ xs: 12 }} key={course._id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid #dadce0',
                      borderRadius: '16px',
                      bgcolor: '#fafafc',
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'left' }}>
                      <Chip
                        label={course.category || 'General'}
                        size="small"
                        sx={{
                          bgcolor: '#f0f0f2',
                          color: '#0085e4',
                          fontWeight: 600,
                          borderRadius: '6px',
                          mb: 1,
                          fontSize: '11px',
                        }}
                      />
                      <Typography variant="h6" sx={{ color: '#161637', fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666666',
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '40px',
                        }}
                      >
                        {course.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled={enrollLoadingId === course._id}
                        onClick={() => handleEnroll(course._id)}
                        sx={{ borderRadius: '8px' }}
                      >
                        {enrollLoadingId === course._id ? <CircularProgress size={20} color="inherit" /> : 'Quick Enroll'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
