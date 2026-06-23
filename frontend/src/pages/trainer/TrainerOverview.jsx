import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import TopicIcon from '@mui/icons-material/Assignment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useCustomFetch from '../../hooks/useCustomFetch';

export default function TrainerOverview() {
  const navigate = useNavigate();
  const { data: metrics, loading, error } = useCustomFetch('/trainer/get-metrics');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: '8px', mb: 3 }}>
        {error}
      </Alert>
    );
  }

  const cards = [
    { title: 'My Courses', value: metrics?.totalCourses || 0, icon: <BookIcon sx={{ color: '#0085e4' }} />, desc: 'Created by you' },
    { title: 'Total Topics', value: metrics?.totalTopics || 0, icon: <TopicIcon sx={{ color: '#0085e4' }} />, desc: 'Interactive lessons' },
    { title: 'Enrolled Students', value: metrics?.totalStudentsEnrolled || 0, icon: <SchoolIcon sx={{ color: '#0085e4' }} />, desc: 'Unique active learners' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'left' }}>
        <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
          Trainer Workspace
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          Overview of your learning metrics and courses inside Overflow LMS.
        </Typography>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
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
                    {card.title}
                  </Typography>
                  <Box sx={{ p: 1, bgcolor: '#f0f0f2', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, letterSpacing: '-1px' }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666666' }}>
                  {card.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Navigation Panels */}
      <Box sx={{ textAlign: 'left', mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#161637', fontWeight: 700, mb: 1.5, letterSpacing: '-0.6px' }}>
          Quick Actions
        </Typography>
        <Typography variant="body2" sx={{ color: '#666666', mb: 3 }}>
          Manage your curriculum materials, courses, and view student performance.
        </Typography>

        <Grid container spacing={4}>
          {/* Courses Action Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #dadce0',
                borderRadius: '24px',
                bgcolor: '#ffffff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ color: '#161637', fontWeight: 700, mb: 1 }}>
                  Course Builder & Topics
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 3, lineHeight: 1.6 }}>
                  Create and update courses, upload syllabus outlines, and add/reorder topics with embedded YouTube or Google Drive video lectures.
                </Typography>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/dashboard/trainer/courses')}
                  sx={{ borderRadius: '12px', px: 3, py: 1.25 }}
                >
                  Manage Courses & Topics
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Students Action Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #dadce0',
                borderRadius: '24px',
                bgcolor: '#ffffff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ color: '#161637', fontWeight: 700, mb: 1 }}>
                  Student Enrollment Roster
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 3, lineHeight: 1.6 }}>
                  View a list of active students enrolled in your courses, monitor enrollment statistics, and track progress metrics.
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/dashboard/trainer/students')}
                  sx={{ borderRadius: '12px', px: 3, py: 1.25 }}
                >
                  View Enrolled Students
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
