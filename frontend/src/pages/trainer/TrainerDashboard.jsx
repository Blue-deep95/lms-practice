import React from 'react';
import { Container, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    alert('Logged out successfully');
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Trainer Dashboard
            </Typography>
            <Button variant="outlined" color="primary" onClick={handleLogout} sx={{ ml: 'auto' }}>
              Logout
            </Button>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Welcome to the Trainer workspace! Create new courses, manage your lessons, and review student progress.
          </Typography>
          <Box sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: 3, border: '1px dashed #cbd5e1', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Dummy Trainer Dashboard Content (Nothing here yet)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
