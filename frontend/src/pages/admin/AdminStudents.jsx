import { useState } from 'react';
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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import API from '../../api/api';
import useCustomFetch from '../../hooks/useCustomFetch';

export default function AdminStudents() {
  const {
    data: studentsData,
    loading,
    error,
    refetch: fetchStudents,
    setData: setStudents,
  } = useCustomFetch('/admin/students');

  const students = studentsData || [];

  // Dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // Null for add, User object for edit
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setName('');
    setEmail('');
    // Auto-generate a random 8-character password
    setPassword(Math.random().toString(36).slice(-8) + 'S1!');
    setSubmitError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setName(student.name || student.username);
    setEmail(student.email);
    setPassword('');
    setSubmitError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');

    try {
      if (editingStudent) {
        // Edit Student
        const response = await API.put(`/admin/students/${editingStudent._id}`, { name, email });
        if (response.data.success) {
          alert('Student updated successfully!');
          fetchStudents();
          handleCloseModal();
        }
      } else {
        // Add Student
        const response = await API.post('/admin/students', { name, email, password });
        if (response.data.success) {
          alert(`Student added successfully!\nEmail: ${email}\nGenerated Password: ${password}`);
          fetchStudents();
          handleCloseModal();
        }
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit student form.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    if (!window.confirm('Are you sure you want to toggle this student\'s active status?')) return;
    try {
      const response = await API.put(`/admin/students/${id}/status`);
      if (response.data.success) {
        setStudents(students.map(s => s._id === id ? { ...s, status: response.data.data.status } : s));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student? All their enrollments will be wiped.')) return;
    try {
      const response = await API.delete(`/admin/students/${id}`);
      if (response.data.success) {
        alert('Student deleted successfully');
        setStudents(students.filter(s => s._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student.');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
            Students
          </Typography>
          <Typography variant="body1" sx={{ color: '#666666' }}>
            Register new students manually and overview active learners.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ padding: '12px 24px' }}
        >
          Add Student
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
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                    No students registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student._id} sx={{ '&:last-child cell': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#161637' }}>{student.name || 'Unnamed Student'}</TableCell>
                    <TableCell sx={{ color: '#666666' }}>{student.email}</TableCell>
                    <TableCell sx={{ color: '#666666', fontFamily: 'monospace' }}>{student.username}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.status === 'active' ? 'Active' : 'Inactive'}
                        color={student.status === 'active' ? 'success' : 'default'}
                        variant={student.status === 'active' ? 'filled' : 'outlined'}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: '6px' }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton 
                        onClick={() => handleToggleStatus(student._id)} 
                        title={student.status === 'active' ? 'Deactivate' : 'Activate'}
                        sx={{ color: student.status === 'active' ? '#d32f2f' : '#2e7d32', mr: 1 }}
                      >
                        {student.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                      </IconButton>
                      <IconButton onClick={() => handleOpenEdit(student)} sx={{ color: '#0085e4', mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(student._id)} sx={{ color: '#000000' }}>
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
            maxWidth: '450px',
            bgcolor: '#fafafc',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#161637', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingStudent ? 'Edit Student' : 'Add Student'}
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
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            {!editingStudent && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Generated Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Admin-generated password for the student."
                sx={{ 
                  mb: 2,
                  '& .MuiInputBase-input': { fontFamily: 'monospace', fontWeight: 'bold' }
                }}
              />
            )}
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
              {submitLoading ? <CircularProgress size={20} color="inherit" /> : editingStudent ? 'Update' : 'Register'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
