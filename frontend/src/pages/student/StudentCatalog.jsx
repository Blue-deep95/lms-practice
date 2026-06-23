import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, TextField, CircularProgress, Alert, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import ExploreIcon from '@mui/icons-material/Explore';
import useCustomFetch from '../../hooks/useCustomFetch';
import API from '../../api/api';

export default function StudentCatalog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [enrollLoadingId, setEnrollLoadingId] = useState(null);

  // Fetch all courses and the student's enrollments
  const { data: courses, loading: coursesLoading, error: coursesError } = useCustomFetch('/courses/get-courses');
  const { data: enrollments, loading: enrollmentsLoading, refetch: refetchEnrollments } = useCustomFetch('/student/enrollments');

  const handleEnroll = async (courseId) => {
    setEnrollLoadingId(courseId);
    try {
      const response = await API.post('/student/enroll', { courseId });
      if (response.data.success) {
        alert('Successfully enrolled in course!');
        refetchEnrollments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrollLoadingId(null);
    }
  };

  const isLoading = coursesLoading || enrollmentsLoading;

  if (isLoading && !courses) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (coursesError) {
    return (
      <Alert severity="error" sx={{ borderRadius: '8px', mb: 3 }}>
        {coursesError}
      </Alert>
    );
  }

  // Cross-reference enrolled courses
  const enrolledIds = new Set(enrollments?.map((c) => c._id) || []);

  // Get dynamic categories list
  const categories = ['All', ...new Set((courses || []).map((c) => c.category).filter(Boolean))];

  // Filter courses based on search query and category
  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Unique pastel gradients based on course title hash to act as premium thumbnail fallback
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
      {/* Title & Page Header */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
            Course Catalog
          </Typography>
          <Typography variant="body1" sx={{ color: '#666666' }}>
            Browse through all available programs, enroll instantly, and jumpstart your career.
          </Typography>
        </Box>
      </Box>

      {/* Search and Category Filter Block */}
      <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          placeholder="Search by course title or description..."
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

        {/* Category Filters line */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#666666', fontWeight: 600, mr: 1 }}>
            Filter Category:
          </Typography>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setSelectedCategory(cat)}
              sx={{
                bgcolor: selectedCategory === cat ? '#161637' : '#f0f0f2',
                color: selectedCategory === cat ? '#fafafc' : '#161637',
                fontWeight: 600,
                borderRadius: '8px',
                px: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: selectedCategory === cat ? '#161637' : '#e2e2e6',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Box sx={{ p: 8, border: '1px dashed #dadce0', borderRadius: '24px', textAlign: 'center', bgcolor: '#fafafc' }}>
          <Typography variant="h6" sx={{ color: '#161637', mb: 1 }}>
            No courses found
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666' }}>
            Try expanding your search query or choosing another category filter.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledIds.has(course._id);
            return (
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
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 'rgba(0, 0, 0, 0.08) 0px 12px 30px -8px',
                    },
                  }}
                >
                  {/* Card Image Thumbnail or Premium Gradient Fallback */}
                  {course.thumbnail ? (
                    <CardMedia component="img" height="160" image={course.thumbnail} alt={course.title} />
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
                      <SchoolIcon sx={{ fontSize: 48, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }} />
                    </Box>
                  )}

                  <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      {isEnrolled && (
                        <Chip
                          label="Enrolled"
                          size="small"
                          icon={<PlayArrowIcon fontSize="small" style={{ color: '#ffffff' }} />}
                          sx={{
                            bgcolor: '#2e7d32',
                            color: '#ffffff',
                            fontWeight: 600,
                            borderRadius: '6px',
                            '& .MuiChip-icon': { color: '#ffffff' },
                          }}
                        />
                      )}
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

                    {/* Trainer name & call to actions */}
                    <Box sx={{ mt: 'auto', textAlign: 'left', pt: 2, borderTop: '1px solid #dadce0' }}>
                      <Typography variant="caption" sx={{ color: '#999999', display: 'block', mb: 2 }}>
                        Instructor: <span style={{ fontWeight: 600, color: '#161637' }}>{course.trainerId?.username || 'Unassigned'}</span>
                      </Typography>

                      {isEnrolled ? (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<PlayArrowIcon />}
                          onClick={() => navigate(`/dashboard/student/courses/${course._id}/learn`)}
                          sx={{ borderRadius: '12px', py: 1.5 }}
                        >
                          Resume Learning
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<ExploreIcon />}
                          disabled={enrollLoadingId === course._id}
                          onClick={() => handleEnroll(course._id)}
                          sx={{ borderRadius: '12px', py: 1.5 }}
                        >
                          {enrollLoadingId === course._id ? <CircularProgress size={22} color="inherit" /> : 'Enroll Now'}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
