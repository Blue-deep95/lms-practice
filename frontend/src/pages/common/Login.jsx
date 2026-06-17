import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await API.post('/auth/login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.accessToken);
        loginUser(response.data.user);
        alert('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Card 
        elevation={0} 
        sx={{ 
          border: '1px solid #dadce0', 
          borderRadius: '24px',
          bgcolor: '#fafafc',
          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 16px -8px'
        }}
      >
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          {/* Logo Badge */}
          <Box 
            sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '12px', 
              bgcolor: '#161637', // Midnight Ink
              color: '#fafafc', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mx: 'auto', 
              mb: 3,
            }}
          >
            <SchoolIcon fontSize="small" />
          </Box>

          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1.5, 
              color: '#161637',
              letterSpacing: '-0.4px'
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666666', // Graphite
              mb: 4,
              letterSpacing: '-0.08px'
            }}
          >
            Enter your credentials to access your courses
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="Email Address"
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
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <Typography 
                variant="body2" 
                component={Link} 
                to="/forgot-password" 
                sx={{ 
                  color: '#0085e4', // Sky Accent
                  textDecoration: 'none', 
                  fontWeight: 500,
                  letterSpacing: '-0.08px',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                py: 1.8, 
                mb: 3,
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Typography variant="body2" sx={{ color: '#666666' }}>
              Don't have an account?{' '}
              <Typography 
                variant="body2" 
                component={Link} 
                to="/register" 
                sx={{ 
                  color: '#0085e4', // Sky Accent
                  textDecoration: 'none', 
                  fontWeight: 600,
                  letterSpacing: '-0.08px',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign Up
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
