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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import API from '../../api/api';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null); // Null for add, User object for edit
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/admin/trainers');
      if (response.data.success) {
        setTrainers(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trainers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchTrainers();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingTrainer(null);
    setName('');
    setEmail('');
    // Auto-generate a random 8-character password for convenience
    setPassword(Math.random().toString(36).slice(-8) + 'A1!');
    setSubmitError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (trainer) => {
    setEditingTrainer(trainer);
    setName(trainer.name || trainer.username);
    setEmail(trainer.email);
    setPassword(''); // Don't edit password here
    setSubmitError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTrainer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');

    try {
      if (editingTrainer) {
        // Edit Trainer
        const response = await API.put(`/admin/trainers/${editingTrainer._id}`, { name, email });
        if (response.data.success) {
          alert('Trainer updated successfully!');
          fetchTrainers();
          handleCloseModal();
        }
      } else {
        // Add Trainer
        const response = await API.post('/admin/trainers', { name, email, password });
        if (response.data.success) {
          alert(`Trainer added successfully!\nEmail: ${email}\nGenerated Password: ${password}`);
          fetchTrainers();
          handleCloseModal();
        }
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit trainer form.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    if (!window.confirm('Are you sure you want to change this trainer\'s active status?')) return;
    try {
      const response = await API.put(`/admin/trainers/${id}/status`);
      if (response.data.success) {
        setTrainers(trainers.map(t => t._id === id ? { ...t, status: response.data.data.status } : t));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer? All their courses will be unassigned.')) return;
    try {
      const response = await API.delete(`/admin/trainers/${id}`);
      if (response.data.success) {
        alert('Trainer deleted successfully');
        setTrainers(trainers.filter(t => t._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete trainer.');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
            Trainers
          </Typography>
          <Typography variant="body1" sx={{ color: '#666666' }}>
            Register new instructors and manage active course trainers.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ padding: '12px 24px' }}
        >
          Add Trainer
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
              {trainers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                    No trainers registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                trainers.map((trainer) => (
                  <TableRow key={trainer._id} sx={{ '&:last-child cell': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#161637' }}>{trainer.name || 'Unnamed Trainer'}</TableCell>
                    <TableCell sx={{ color: '#666666' }}>{trainer.email}</TableCell>
                    <TableCell sx={{ color: '#666666', fontFamily: 'monospace' }}>{trainer.username}</TableCell>
                    <TableCell>
                      <Chip
                        label={trainer.status === 'active' ? 'Active' : 'Inactive'}
                        color={trainer.status === 'active' ? 'success' : 'default'}
                        variant={trainer.status === 'active' ? 'filled' : 'outlined'}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: '6px' }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton 
                        onClick={() => handleToggleStatus(trainer._id)} 
                        title={trainer.status === 'active' ? 'Deactivate' : 'Activate'}
                        sx={{ color: trainer.status === 'active' ? '#d32f2f' : '#2e7d32', mr: 1 }}
                      >
                        {trainer.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                      </IconButton>
                      <IconButton onClick={() => handleOpenEdit(trainer)} sx={{ color: '#0085e4', mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(trainer._id)} sx={{ color: '#000000' }}>
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
          {editingTrainer ? 'Edit Trainer' : 'Add Trainer'}
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

            {!editingTrainer && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Generated Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Admin-generated password for the trainer. Copy this for their registration."
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
              {submitLoading ? <CircularProgress size={20} color="inherit" /> : editingTrainer ? 'Update' : 'Register'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
