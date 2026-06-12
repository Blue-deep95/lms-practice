import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  MenuItem 
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Submitted:', { name, email, role, password, confirmPassword });
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Logo */}
          <Box 
            sx={{ 
              width: 50, 
              height: 50, 
              borderRadius: 2.5, 
              bgcolor: 'primary.main', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mx: 'auto', 
              mb: 2,
              boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.3)'
            }}
          >
            <SchoolIcon fontSize="medium" />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Join LearnSphere LMS today
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              select
              margin="normal"
              required
              fullWidth
              id="role"
              label="Join As"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ mb: 2, textAlign: 'left' }}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="trainer">Trainer</MenuItem>
            </TextField>

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                py: 1.5, 
                mb: 3, 
                boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.25)',
                '&:hover': {
                  boxShadow: '0 6px 16px 0 rgba(79, 70, 229, 0.35)',
                }
              }}
            >
              Sign Up
            </Button>

            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Typography variant="body2" component={Link} to="/login" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>
                Sign In
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
