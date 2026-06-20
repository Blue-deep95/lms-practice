import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import TopicIcon from '@mui/icons-material/Assignment';
import API from '../../api/api';
import useCustomFetch from '../../hooks/useCustomFetch';

export default function TrainerCourses() {
  const navigate = useNavigate();
  const {
    data: coursesData,
    loading,
    error,
    refetch: fetchCourses,
    setData: setCourses,
  } = useCustomFetch('/courses/get-courses');

  const courses = coursesData || [];

  // Dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setThumbnail('');
    setSubmitError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category || '');
    setThumbnail(course.thumbnail || '');
    setSubmitError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');

    try {
      if (editingCourse) {
        // Update Course
        const response = await API.put(`/courses/update-course/${editingCourse._id}`, {
          title,
          description,
          category,
          thumbnail,
        });
        if (response.data.success) {
          alert('Course updated successfully!');
          fetchCourses();
          handleCloseModal();
        }
      } else {
        // Create Course
        const response = await API.post('/courses/create-course', {
          title,
          description,
          category,
          thumbnail,
        });
        if (response.data.success) {
          alert('Course created successfully!');
          fetchCourses();
          handleCloseModal();
        }
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit course.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? All topics and student enrollments inside it will be permanently deleted.')) return;
    try {
      const response = await API.delete(`/courses/delete-course/${id}`);
      if (response.data.success) {
        alert('Course deleted successfully');
        setCourses(courses.filter((c) => c._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
            My Courses
          </Typography>
          <Typography variant="body1" sx={{ color: '#666666' }}>
            Manage the content, settings, and topics for courses you teach.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ padding: '12px 24px' }}
        >
          Create Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #dadce0', borderRadius: '24px', overflowX: 'auto', bgcolor: '#fafafc' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f0f0f2' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Course Title</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                    You have not created any courses yet.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course._id} sx={{ '&:last-child cell': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#161637', minWidth: '180px' }}>{course.title}</TableCell>
                    <TableCell sx={{ color: '#666666' }}>{course.category || 'General'}</TableCell>
                    <TableCell sx={{ color: '#666666', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {course.description}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right', minWidth: '180px' }}>
                      <Button
                        variant="outlined"
                        startIcon={<TopicIcon />}
                        size="small"
                        onClick={() => navigate(`/dashboard/trainer/courses/${course._id}/topics`)}
                        sx={{ mr: 1, borderRadius: '8px', textTransform: 'none' }}
                      >
                        Topics
                      </Button>
                      <IconButton onClick={() => handleOpenEdit(course)} sx={{ color: '#0085e4', mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(course._id)} sx={{ color: '#000000' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Form Dialog Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            border: '1px solid #dadce0',
            p: 2,
            width: '100%',
            maxWidth: '500px',
            bgcolor: '#fafafc',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#161637', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingCourse ? 'Edit Course' : 'Create Course'}
          <IconButton onClick={handleCloseModal} size="small" sx={{ color: '#666666' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                {submitError}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={3}
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              placeholder="Category (e.g., Design, HTML, CSS)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              placeholder="Thumbnail Image URL"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleCloseModal} sx={{ color: '#666666' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitLoading}
              sx={{ borderRadius: '12px', px: 3 }}
            >
              {submitLoading ? <CircularProgress size={20} color="inherit" /> : editingCourse ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
