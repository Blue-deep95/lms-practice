import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import API from '../../api/api';
import useCustomFetch from '../../hooks/useCustomFetch';

// Helper to extract YouTube video ID and return embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : '';
};

export default function TrainerTopics() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Fetch course name
  const { data: courses } = useCustomFetch('/courses/get-courses');
  const course = courses?.find((c) => c._id === courseId);
  const courseTitle = course ? course.title : 'Course Topics';

  // Fetch topics list
  const {
    data: topicsData,
    loading,
    error,
    refetch: fetchTopics,
    setData: setTopics,
  } = useCustomFetch(`/topics/get-topics?courseId=${courseId}`);

  const topics = topicsData || [];

  // Dialog & Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Reorder states
  const [isReordering, setIsReordering] = useState(false);
  const [tempTopics, setTempTopics] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  // Video preview dialog states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const displayedTopics = isReordering ? tempTopics : topics;

  const handleOpenAdd = () => {
    setEditingTopic(null);
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setSubmitError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (topic) => {
    setEditingTopic(topic);
    setTitle(topic.title);
    setDescription(topic.description);
    setVideoUrl(topic.videoUrl || '');
    setSubmitError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTopic(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');

    const embedTestUrl = getYouTubeEmbedUrl(videoUrl);
    if (videoUrl && !embedTestUrl) {
      setSubmitError('Invalid YouTube video link. Please enter a valid watch or share link.');
      setSubmitLoading(false);
      return;
    }

    try {
      if (editingTopic) {
        // Edit Topic
        const response = await API.put(`/topics/update-topic/${editingTopic._id}`, {
          title,
          description,
          videoUrl,
        });
        if (response.data.success) {
          alert('Topic updated successfully!');
          fetchTopics();
          handleCloseModal();
        }
      } else {
        // Create Topic
        const response = await API.post('/topics/create-topic', {
          courseId,
          title,
          description,
          videoUrl,
        });
        if (response.data.success) {
          alert('Topic created successfully!');
          fetchTopics();
          handleCloseModal();
        }
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit topic.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this topic? Topic numbers will automatically reorder.')) return;
    try {
      const response = await API.delete(`/topics/delete-topic/${id}`);
      if (response.data.success) {
        alert('Topic deleted successfully');
        fetchTopics();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete topic.');
    }
  };

  const handleStartReorder = () => {
    setTempTopics([...topics]);
    setIsReordering(true);
  };

  const handleCancelReorder = () => {
    setIsReordering(false);
    setTempTopics([]);
  };

  const handleSaveReorder = async () => {
    setSaveLoading(true);
    try {
      const topicIds = tempTopics.map((t) => t._id);
      const response = await API.put('/topics/reorder-topics', { courseId, topicIds });
      if (response.data.success) {
        alert('Topics reordered successfully!');
        setTopics(response.data.data);
        setIsReordering(false);
        setTempTopics([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save new order.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleMoveLocal = (index, direction) => {
    const newTopics = [...tempTopics];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newTopics.length) return;

    const temp = newTopics[index];
    newTopics[index] = newTopics[targetIndex];
    newTopics[targetIndex] = temp;

    setTempTopics(newTopics);
  };

  const handleOpenPreview = (url) => {
    setPreviewUrl(getYouTubeEmbedUrl(url));
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl('');
  };

  return (
    <Box>
      {/* Top Header Navigation */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton onClick={() => navigate('/dashboard/trainer/courses')} sx={{ color: '#161637' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2" sx={{ color: '#666666', fontWeight: 550 }}>
          Back to My Courses
        </Typography>
      </Box>

      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
            {courseTitle}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666666' }}>
            Organize materials, insert YouTube videos, and arrange the topic teaching sequence.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isReordering ? (
            <>
              <Button
                variant="outlined"
                onClick={handleCancelReorder}
                sx={{ padding: '12px 24px', borderColor: '#666666', color: '#666666', '&:hover': { borderColor: '#444444', color: '#444444' } }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveReorder}
                disabled={saveLoading}
                sx={{ padding: '12px 24px', bgcolor: '#2e7d32', color: '#ffffff', '&:hover': { bgcolor: '#1b5e20' } }}
              >
                {saveLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Order'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                disabled={topics.length <= 1}
                onClick={handleStartReorder}
                sx={{ padding: '12px 24px', borderColor: '#161637', color: '#161637', '&:hover': { borderColor: '#0d0d21', bgcolor: '#f0f0f2' } }}
              >
                Reorder Topics
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAdd}
                sx={{ padding: '12px 24px' }}
              >
                Add Topic
              </Button>
            </>
          )}
        </Box>
      </Box>

      {isReordering && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
          You are in Reorder Mode. Use the Up and Down arrows next to each topic to rearrange them, then click "Save Order" to commit the changes.
        </Alert>
      )}

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
                <TableCell sx={{ fontWeight: 700, color: '#161637', width: '80px' }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Topic Title</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637', width: '120px' }}>Video</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637', width: '120px', textAlign: 'center' }}>Move</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637', textAlign: 'right', width: '150px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedTopics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                    No topics added yet. Click Add Topic to start building the curriculum.
                  </TableCell>
                </TableRow>
              ) : (
                displayedTopics.map((topic, index) => (
                  <TableRow key={topic._id} sx={{ '&:last-child cell': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#666666' }}>#{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#161637', minWidth: '150px' }}>{topic.title}</TableCell>
                    <TableCell sx={{ color: '#666666', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {topic.description}
                    </TableCell>
                    <TableCell>
                      {topic.videoUrl ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PlayCircleOutlinedIcon />}
                          onClick={() => handleOpenPreview(topic.videoUrl)}
                          sx={{ textTransform: 'none', borderRadius: '8px' }}
                        >
                          Preview
                        </Button>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#999999' }}>None</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <IconButton
                        disabled={!isReordering || index === 0}
                        onClick={() => handleMoveLocal(index, 'up')}
                        size="small"
                        sx={{ color: isReordering ? '#161637' : '#cccccc' }}
                      >
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        disabled={!isReordering || index === displayedTopics.length - 1}
                        onClick={() => handleMoveLocal(index, 'down')}
                        size="small"
                        sx={{ color: isReordering ? '#161637' : '#cccccc' }}
                      >
                        <ArrowDownwardIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <IconButton
                        disabled={isReordering}
                        onClick={() => handleOpenEdit(topic)}
                        sx={{ color: isReordering ? '#cccccc' : '#0085e4', mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        disabled={isReordering}
                        onClick={() => handleDelete(topic._id)}
                        sx={{ color: isReordering ? '#cccccc' : '#000000' }}
                      >
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
          {editingTopic ? 'Edit Topic' : 'Add Topic'}
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
              placeholder="Topic Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              placeholder="Topic Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              placeholder="YouTube Video Link (e.g., https://youtu.be/...)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              sx={{ mb: 2 }}
              helperText="Paste a YouTube watch link or share URL."
            />

            {/* Video Live Preview inside form */}
            {videoUrl && getYouTubeEmbedUrl(videoUrl) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#666666', display: 'block', mb: 1, fontWeight: 550 }}>
                  Video Preview:
                </Typography>
                <iframe
                  width="100%"
                  height="200"
                  src={getYouTubeEmbedUrl(videoUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ borderRadius: '12px', border: 'none' }}
                />
              </Box>
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
              {submitLoading ? <CircularProgress size={20} color="inherit" /> : editingTopic ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Video Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', bgcolor: '#000000', p: 1 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
          <IconButton onClick={handleClosePreview} sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {previewUrl && (
            <iframe
              width="100%"
              height="450"
              src={previewUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
