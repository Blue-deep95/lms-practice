import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Container, Divider, Typography, Grid, Paper, List, ListItem, ListItemButton, ListItemText, Button, IconButton, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import useCustomFetch from '../../hooks/useCustomFetch';
import API from '../../api/api';

// Helper to extract video ID and return embed URL (supports YouTube and Google Drive)
const getVideoEmbedUrl = (url) => {
  if (!url) return '';

  // 1. YouTube extraction
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const ytMatch = url.match(ytRegExp);
  if (ytMatch && ytMatch[2].length === 11) {
    return `https://www.youtube.com/embed/${ytMatch[2]}`;
  }

  // 2. Google Drive extraction
  // Pattern A: /file/d/[FILE_ID]/...
  const gdFileRegExp = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdFileMatch = url.match(gdFileRegExp);
  if (gdFileMatch && gdFileMatch[1]) {
    return `https://drive.google.com/file/d/${gdFileMatch[1]}/preview`;
  }

  // Pattern B: open?id=[FILE_ID]
  const gdOpenRegExp = /[?&]id=([a-zA-Z0-9_-]+)/;
  const gdOpenMatch = url.match(gdOpenRegExp);
  if (gdOpenMatch && gdOpenMatch[1]) {
    return `https://drive.google.com/file/d/${gdOpenMatch[1]}/preview`;
  }

  return '';
};

export default function StudentLearn() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Fetch course detail, topics list, and student enrollments to verify access
  const { data: courses, loading: coursesLoading } = useCustomFetch('/courses/get-courses');
  const { data: topics, loading: topicsLoading } = useCustomFetch(`/topics/get-topics?courseId=${courseId}`);
  const { data: enrollments, loading: enrollmentsLoading, refetch: refetchEnrollments } = useCustomFetch('/student/enrollments');

  const course = courses?.find((c) => c._id === courseId);
  const isEnrolled = enrollments?.some((e) => e._id === courseId);

  const handleEnroll = async () => {
    setEnrollLoading(true);
    try {
      const response = await API.post('/student/enroll', { courseId });
      if (response.data.success) {
        alert('Enrolled in course successfully!');
        refetchEnrollments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrollLoading(false);
    }
  };

  const isLoading = coursesLoading || topicsLoading || enrollmentsLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Security check: If course is valid but student is not enrolled
  if (course && !isEnrolled) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ borderRadius: '16px', py: 3, px: 4, mb: 4, bgcolor: '#fffde7', border: '1px solid #fff59d' }}
        >
          <Typography variant="h6" sx={{ color: '#161637', fontWeight: 700, mb: 1 }}>
            You are not enrolled in this course
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666', mb: 2.5 }}>
            To view the lesson materials, video lectures, and start studying, you need to enroll in this course.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              disabled={enrollLoading}
              onClick={handleEnroll}
              sx={{ borderRadius: '8px' }}
            >
              {enrollLoading ? <CircularProgress size={20} color="inherit" /> : 'Enroll Now'}
            </Button>
            <Button component={Link} to="/dashboard/student/catalog" variant="outlined" sx={{ borderRadius: '8px' }}>
              Back to Catalog
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Alert severity="error" sx={{ borderRadius: '8px' }}>
        Course not found or invalid.
      </Alert>
    );
  }

  const topicList = topics || [];
  const currentTopic = topicList[selectedTopicIndex];
  const embedUrl = currentTopic ? getVideoEmbedUrl(currentTopic.videoUrl) : '';

  const handlePrev = () => {
    if (selectedTopicIndex > 0) {
      setSelectedTopicIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (selectedTopicIndex < topicList.length - 1) {
      setSelectedTopicIndex((prev) => prev + 1);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top Header & Navigation */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5, textAlign: 'left' }}>
        <IconButton onClick={() => navigate('/dashboard/student/courses')} sx={{ color: '#161637', bgcolor: '#ffffff', border: '1px solid #dadce0' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="caption" sx={{ color: '#666666', fontWeight: 550 }}>
            COURSE PLAYER
          </Typography>
          <Typography variant="h4" sx={{ color: '#161637', fontWeight: 800, letterSpacing: '-0.4px', lineHeight: 1.2 }}>
            {course.title}
          </Typography>
        </Box>
      </Box>

      {topicList.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            border: '1px dashed #dadce0',
            borderRadius: '24px',
            textAlign: 'center',
            bgcolor: '#fafafc',
          }}
        >
          <Typography variant="h5" sx={{ color: '#161637', mb: 1.5, fontWeight: 700 }}>
            No topics published yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666', mb: 4 }}>
            The instructor hasn't uploaded any syllabus lessons to this course yet. Check back later!
          </Typography>
          <Button component={Link} to="/dashboard/student/courses" variant="outlined" sx={{ borderRadius: '12px' }}>
            Back to My Courses
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Left Column: Topics Sidebar Selector */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ color: '#161637', fontWeight: 700, mb: 2, textAlign: 'left', letterSpacing: '-0.16px' }}>
              Curriculum Outline
            </Typography>
            <Paper
              elevation={0}
              sx={{
                border: '1px solid #dadce0',
                borderRadius: '16px',
                bgcolor: '#ffffff',
                overflow: 'hidden',
              }}
            >
              <List disablePadding>
                {topicList.map((topic, index) => {
                  const isSelected = index === selectedTopicIndex;
                  return (
                    <Box key={topic._id}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => setSelectedTopicIndex(index)}
                          sx={{
                            py: 2,
                            px: 2.5,
                            alignItems: 'flex-start',
                            bgcolor: isSelected ? '#161637' : 'transparent',
                            color: isSelected ? '#fafafc' : '#161637',
                            borderLeft: isSelected ? '4px solid #0085e4' : '4px solid transparent',
                            '&:hover': {
                              bgcolor: isSelected ? '#161637' : '#f0f0f2',
                            },
                          }}
                        >
                          <PlayCircleOutlinedIcon
                            fontSize="small"
                            sx={{
                              mr: 1.5,
                              mt: '2px',
                              color: isSelected ? '#0085e4' : '#666666',
                            }}
                          />
                          <ListItemText
                            primary={`Topic ${index + 1}: ${topic.title}`}
                            primaryTypographyProps={{
                              fontSize: '14px',
                              fontWeight: 650,
                              lineHeight: 1.3,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                      {index < topicList.length - 1 && <Divider sx={{ borderColor: '#f0f0f2' }} />}
                    </Box>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          {/* Right Column: Player and Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {currentTopic && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Embedded Video Player */}
                {currentTopic.videoUrl && embedUrl ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%', // 16:9 Aspect Ratio
                      borderRadius: '16px',
                      overflow: 'hidden',
                      bgcolor: '#000000',
                      boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 12px',
                      border: '1px solid #dadce0',
                    }}
                  >
                    <iframe
                      src={embedUrl}
                      title={currentTopic.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: '350px',
                      bgcolor: '#f0f0f2',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #dadce0',
                      p: 4,
                    }}
                  >
                    <WarningAmberIcon sx={{ fontSize: 48, color: '#666666', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#161637', fontWeight: 700, mb: 1 }}>
                      No Video Lecture Available
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666' }}>
                      This topic contains study notes and readings, but no video lecture.
                    </Typography>
                  </Box>
                )}

                {/* Lesson Navigation Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    disabled={selectedTopicIndex === 0}
                    onClick={handlePrev}
                    sx={{ borderRadius: '8px', px: 2 }}
                  >
                    Prev Lesson
                  </Button>
                  <Typography variant="caption" sx={{ color: '#666666', fontWeight: 600 }}>
                    Lesson {selectedTopicIndex + 1} of {topicList.length}
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<NavigateNextIcon />}
                    disabled={selectedTopicIndex === topicList.length - 1}
                    onClick={handleNext}
                    sx={{ borderRadius: '8px', px: 2 }}
                  >
                    Next Lesson
                  </Button>
                </Box>

                {/* Lesson Details Text */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    border: '1px solid #dadce0',
                    borderRadius: '16px',
                    bgcolor: '#fafafc',
                    textAlign: 'left',
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#161637', fontWeight: 800, mb: 2, letterSpacing: '-0.24px' }}>
                    {currentTopic.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666666', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {currentTopic.description || 'No description provided for this lesson.'}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
