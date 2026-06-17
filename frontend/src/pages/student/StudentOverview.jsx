import { Box, Typography } from '@mui/material';

export default function StudentOverview() {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
        Student Portal
      </Typography>
      <Typography variant="body1" sx={{ color: '#666666' }}>
        Welcome to your student learning hub. Enrolled courses and learning materials will be added here in future phases.
      </Typography>
    </Box>
  );
}
