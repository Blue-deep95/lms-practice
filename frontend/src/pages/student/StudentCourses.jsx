import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, TextField, CircularProgress, Alert, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import ExploreIcon from '@mui/icons-material/Explore';
import useCustomFetch from '../../hooks/useCustomFetch';

export default function StudentCourses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch enrolled courses
  const { data: enrollments, loading, error } = useCustomFetch('/student/enrollments');

  if (loading && !enrollments) {
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

  const courses = enrollments || [];

  // Filter enrolled courses
  const filteredCourses = courses.filter((course) => {
    return (
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getGradientForTitle = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 75%, 75%) 0%, hsl(${hue2}, 75%, 55%) 100%)`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
            My Enrolled Courses
          </Typography>
          <Typography variant="body1" sx={{ color: '#666666' }}>
            Manage your studies, track progress, and review subject materials.
          </Typography>
        </Box>
      </Box>

      {courses.length === 0 ? (
        <Box sx={{ p: 8, border: '1px dashed #dadce0', borderRadius: '24px', textAlign: 'center', bgcolor: '#fafafc' }}>
          <Typography variant="h5" sx={{ color: '#161637', mb: 1.5, fontWeight: 700 }}>
            You haven't enrolled in any courses yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666', mb: 4 }}>
            Explore our catalog of structured paths and start learning today!
          </Typography>
          <Button
            component={Link}
            to="/dashboard/student/catalog"
            variant="contained"
            startIcon={<ExploreIcon />}
            sx={{ px: 3, py: 1.5 }}
          >
            Browse Course Catalog
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 5 }}>
            <TextField
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666666' }} />
                    </InputAdornment>
                  ),
                }
              }}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: '12px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  border: '1px solid #dadce0',
                  '& fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: '#161637' },
                },
              }}
            />
          </Box>

          {filteredCourses.length === 0 ? (
            <Box sx={{ p: 6, border: '1px dashed #dadce0', borderRadius: '24px', textAlign: 'center', bgcolor: '#fafafc' }}>
              <Typography variant="body1" sx={{ color: '#666666' }}>
                No courses match your search description.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {filteredCourses.map((course) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course._id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      bgcolor: '#fafafc',
                      border: '1px solid #dadce0',
                      borderRadius: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 12px 30px -8px',
                      },
                    }}
                  >
                    {/* Visual Card Media */}
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} style={{ height: 160, width: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box
                        sx={{
                          height: 160,
                          background: getGradientForTitle(course.title),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fafafc',
                        }}
                      >
                        <SchoolIcon sx={{ fontSize: 48 }} />
                      </Box>
                    )}

                    <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
                        <Chip
                          label={course.category || 'General'}
                          size="small"
                          sx={{
                            bgcolor: '#f0f0f2',
                            color: '#161637',
                            fontWeight: 600,
                            borderRadius: '6px',
                          }}
                        />
                      </Box>

                      <Typography variant="h5" sx={{ color: '#161637', fontWeight: 700, mb: 1.5, textAlign: 'left', lineHeight: 1.3 }}>
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666666',
                          textAlign: 'left',
                          mb: 3,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '60px',
                          lineHeight: 1.5,
                        }}
                      >
                        {course.description}
                      </Typography>

                      <Box sx={{ mt: 'auto', textAlign: 'left', pt: 2, borderTop: '1px solid #dadce0' }}>
                        <Typography variant="caption" sx={{ color: '#999999', display: 'block', mb: 2 }}>
                          Instructor: <span style={{ fontWeight: 600, color: '#161637' }}>{course.trainerId?.username || 'Unassigned'}</span>
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<PlayArrowIcon />}
                          onClick={() => navigate(`/dashboard/student/courses/${course._id}/learn`)}
                          sx={{ borderRadius: '12px', py: 1.5 }}
                        >
                          Resume Study
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
