import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    alert('Logged out successfully');
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={0}
      sx={{
        borderBottom: '1px solid #f1f5f9',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              color: 'text.primary', 
              fontWeight: 800, 
              fontSize: '1.4rem',
              letterSpacing: '-0.03em',
              textDecoration: 'none'
            }}
          >
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}> LMS</Box>
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {user ? (
              <>
                <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontSize: '0.9rem' }}>
                  Hello, <span style={{ fontWeight: 600, color: '#1e293b' }}>{user.username}</span> ({user.role})
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 24,
                    padding: '6px 18px',
                    fontSize: '0.85rem'
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link}
                  to="/login"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  component={Link}
                  to="/register"
                  sx={{
                    boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.15)',
                    '&:hover': {
                      boxShadow: '0 6px 16px 0 rgba(79, 70, 229, 0.25)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
