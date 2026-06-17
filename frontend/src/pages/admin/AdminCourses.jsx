import { useState, useEffect } from 'react';
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
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import API from '../../api/api';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Course Dialog states
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [courseSubmitLoading, setCourseSubmitLoading] = useState(false);
  const [courseSubmitError, setCourseSubmitError] = useState('');

  // Assign Trainer Dialog states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningCourse, setAssigningCourse] = useState(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [assignSubmitLoading, setAssignSubmitLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      // Load both courses and trainers in parallel
      const [coursesRes, trainersRes] = await Promise.all([
        API.get('/courses'),
        API.get('/admin/trainers'),
      ]);

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data);
      }
      if (trainersRes.data.success) {
        // Only allow assigning to active trainers
        setTrainers(trainersRes.data.data.filter(t => t.status === 'active'));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch course dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchData();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setThumbnail('');
    setTrainerId('');
    setCourseSubmitError('');
    setCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category || '');
    setThumbnail(course.thumbnail || '');
    setTrainerId(course.trainerId?._id || '');
    setCourseSubmitError('');
    setCourseModalOpen(true);
  };

  const handleOpenAssign = (course) => {
    setAssigningCourse(course);
    setSelectedTrainerId(course.trainerId?._id || '');
    setAssignModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setCourseModalOpen(false);
    setEditingCourse(null);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setAssigningCourse(null);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setCourseSubmitLoading(true);
    setCourseSubmitError('');

    const payload = {
      title,
      description,
      category,
      thumbnail,
      trainerId: trainerId || null,
    };

    try {
      if (editingCourse) {
        const response = await API.put(`/courses/${editingCourse._id}`, payload);
        if (response.data.success) {
          alert('Course updated successfully!');
          fetchData();
          handleCloseCourseModal();
        }
      } else {
        const response = await API.post('/courses', payload);
        if (response.data.success) {
          alert('Course created successfully!');
          fetchData();
          handleCloseCourseModal();
        }
      }
    } catch (err) {
      setCourseSubmitError(err.response?.data?.message || 'Failed to submit course data.');
    } finally {
      setCourseSubmitLoading(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setAssignSubmitLoading(true);

    try {
      const response = await API.put(`/courses/${assigningCourse._id}/assign`, {
        trainerId: selectedTrainerId || null,
      });

      if (response.data.success) {
        alert('Trainer assigned successfully!');
        fetchData();
        handleCloseAssignModal();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign trainer.');
    } finally {
      setAssignSubmitLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? All topics and student enrollments will be permanently deleted.')) return;
    try {
      const response = await API.delete(`/courses/${id}`);
      if (response.data.success) {
        alert('Course deleted successfully');
        setCourses(courses.filter(c => c._id !== id));
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
            Courses
          </Typography>
          <Typography variant="body1" sx={{ color: '#666666' }}>
            Manage platform syllabi and assign courses to instructors.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddCourse}
          sx={{ padding: '12px 24px' }}
        >
          Add Course
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
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Course Title</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Trainer Assigned</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#161637', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                    No courses available yet. Click Add Course to get started.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course._id} sx={{ '&:last-child cell': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#161637' }}>{course.title}</TableCell>
                    <TableCell sx={{ color: '#666666' }}>{course.category || 'General'}</TableCell>
                    <TableCell sx={{ color: course.trainerId ? '#161637' : '#d32f2f', fontWeight: course.trainerId ? 550 : 400 }}>
                      {course.trainerId ? course.trainerId.name || course.trainerId.username : 'Unassigned'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton 
                        onClick={() => handleOpenAssign(course)} 
                        title="Assign Trainer"
                        sx={{ color: '#2e7d32', mr: 1 }}
                      >
                        <AssignmentIndIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleOpenEditCourse(course)} sx={{ color: '#0085e4', mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCourse(course._id)} sx={{ color: '#000000' }}>
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

      {/* Add / Edit Course Dialog */}
      <Dialog
        open={courseModalOpen}
        onClose={handleCloseCourseModal}
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
          {editingCourse ? 'Edit Course' : 'Add Course'}
          <IconButton onClick={handleCloseCourseModal} size="small" sx={{ color: '#666666' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleCourseSubmit}>
          <DialogContent>
            {courseSubmitError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                {courseSubmitError}
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
              placeholder="Category (e.g. Design, HTML, CSS)"
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

            <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#666666', mb: 1, fontWeight: 550 }}>
                Assign Trainer
              </Typography>
              <Select
                value={trainerId}
                onChange={(e) => setTrainerId(e.target.value)}
                displayEmpty
                variant="outlined"
                sx={{ 
                  borderRadius: '8px',
                  bgcolor: '#f0f0f2',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#dadce0' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#161637', borderWidth: '1px' },
                }}
              >
                <MenuItem value=""><em>Unassigned</em></MenuItem>
                {trainers.map((t) => (
                  <MenuItem key={t._id} value={t._id}>{t.name || t.username} ({t.email})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleCloseCourseModal} sx={{ color: '#666666' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={courseSubmitLoading}
              sx={{ borderRadius: '12px', px: 3 }}
            >
              {courseSubmitLoading ? <CircularProgress size={20} color="inherit" /> : editingCourse ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Assign Trainer ONLY Dialog */}
      <Dialog
        open={assignModalOpen}
        onClose={handleCloseAssignModal}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            border: '1px solid #dadce0',
            p: 2,
            width: '100%',
            maxWidth: '400px',
            bgcolor: '#fafafc',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#161637', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Assign Trainer
          <IconButton onClick={handleCloseAssignModal} size="small" sx={{ color: '#666666' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleAssignSubmit}>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#666666', mb: 3 }}>
              Select a trainer to assign to the course: <strong>{assigningCourse?.title}</strong>
            </Typography>

            <FormControl fullWidth>
              <Select
                value={selectedTrainerId}
                onChange={(e) => setSelectedTrainerId(e.target.value)}
                displayEmpty
                variant="outlined"
                sx={{ 
                  borderRadius: '8px',
                  bgcolor: '#f0f0f2',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#dadce0' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#161637', borderWidth: '1px' },
                }}
              >
                <MenuItem value=""><em>Unassigned</em></MenuItem>
                {trainers.map((t) => (
                  <MenuItem key={t._id} value={t._id}>{t.name || t.username}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleCloseAssignModal} sx={{ color: '#666666' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={assignSubmitLoading}
              sx={{ borderRadius: '12px', px: 3 }}
            >
              {assignSubmitLoading ? <CircularProgress size={20} color="inherit" /> : 'Assign'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
