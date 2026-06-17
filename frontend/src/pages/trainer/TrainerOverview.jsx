import { Box, Typography } from '@mui/material';

export default function TrainerOverview() {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography variant="h2" sx={{ color: '#161637', fontWeight: 700, mb: 1, letterSpacing: '-1px' }}>
        Trainer Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: '#666666' }}>
        Welcome to your Trainer workspace. Course creation and student grading options will be added here in future phases.
      </Typography>
    </Box>
  );
}
