import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import useCustomFetch from '../../hooks/useCustomFetch';

export default function TrainerStudents() {
  const { data: studentsData, loading, error } = useCustomFetch('/trainer/get-students');
  const students = studentsData || [];

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'left' }}>
        <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
          My Students
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          Overview of students enrolled in your courses and their registration details.
        </Typography>
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
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Account Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#161637' }}>Enrolled Courses</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#666666' }}>
                    No students enrolled in your courses yet.
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
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {student.courses.map((course) => (
                          <Chip
                            key={course._id}
                            label={course.title}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: '#0085e4',
                              color: '#0085e4',
                              fontWeight: 650,
                              bgcolor: 'rgba(0, 133, 228, 0.04)',
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
