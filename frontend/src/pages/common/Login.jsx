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
  Checkbox, 
  FormControlLabel, 
  Stack 
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Submitted:', { email, password });
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
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
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Enter your credentials to access your courses
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, width: '100%' }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Typography variant="body2" component={Link} to="#" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>
                Forgot password?
              </Typography>
            </Stack>

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
              Sign In
            </Button>

            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Typography variant="body2" component={Link} to="/register" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>
                Sign Up
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
