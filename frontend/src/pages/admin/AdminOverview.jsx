import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import TopicIcon from '@mui/icons-material/Assignment';
import API from '../../api/api';

export default function AdminOverview() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await API.get('/admin/metrics');
        if (response.data.success) {
          setMetrics(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch platform metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

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
    { title: 'Total Trainers', value: metrics?.totalTrainers || 0, icon: <PeopleIcon sx={{ color: '#0085e4' }} />, desc: 'Registered educators' },
    { title: 'Total Students', value: metrics?.totalStudents || 0, icon: <SchoolIcon sx={{ color: '#0085e4' }} />, desc: 'Active learners' },
    { title: 'Total Courses', value: metrics?.totalCourses || 0, icon: <BookIcon sx={{ color: '#0085e4' }} />, desc: 'Curated programs' },
    { title: 'Total Topics', value: metrics?.totalTopics || 0, icon: <TopicIcon sx={{ color: '#0085e4' }} />, desc: 'Interactive lessons' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'left' }}>
        <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
          Overview
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          Real-time metrics and administration overview for Overflow LMS.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
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
    </Box>
  );
}
