import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import API from '../../api/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const navigate = useNavigate();

  // Resend countdown effect
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Request code to be sent to user's email
  const handleSendOtp = async () => {
    if (!email) {
      alert('Please enter your email address first');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setOtpLoading(true);
      setOtpError('');
      const response = await API.post('/auth/send-otp', { email });
      if (response.data.success) {
        setOtpModalOpen(true);
        setResendCountdown(30);
      } else {
        setOtpError(response.data.message || 'Failed to send OTP code.');
        setOtpModalOpen(true); // Open modal anyway so user can see verification UI
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error sending OTP. Please check your backend connection.';
      setOtpError(errMsg);
      // Open modal anyway so user can inspect or test dialog UI
      setOtpModalOpen(true);
    } finally {
      setOtpLoading(false);
    }
  };

  // Submit entered code for verification
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit verification code.');
      return;
    }

    try {
      setOtpLoading(true);
      setOtpError('');
      const response = await API.post('/auth/verify-otp', { email, otp: otpCode });
      if (response.data.success) {
        setIsOtpVerified(true);
        setOtpModalOpen(false);
        alert('Email address verified successfully!');
      } else {
        setOtpError(response.data.message || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Verification failed. Please check the code or your backend connection.';
      setOtpError(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!isOtpVerified) {
      alert('Please verify your email address with OTP first.');
      return;
    }

    try {
      setLoading(true);
      const response = await API.post('/auth/register', { username: name, email, password });
      
      if (response.data.success) {
        alert('Registration successful! Redirecting to login page...');
        navigate('/login');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, width: '100%' }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                disabled={isOtpVerified}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  endAdornment: isOtpVerified ? (
                    <InputAdornment position="end">
                      <CheckCircleIcon color="success" />
                    </InputAdornment>
                  ) : null,
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant={isOtpVerified ? "contained" : "outlined"}
                color={isOtpVerified ? "success" : "primary"}
                onClick={handleSendOtp}
                disabled={isOtpVerified || !email}
                sx={{ 
                  height: '56px', 
                  minWidth: '120px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: isOtpVerified ? '0 4px 12px 0 rgba(46, 125, 50, 0.2)' : 'none'
                }}
              >
                {isOtpVerified ? 'Verified' : 'Verify OTP'}
              </Button>
            </Box>
            
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
              disabled={loading || !isOtpVerified}
              sx={{ 
                py: 1.5, 
                mb: 3, 
                boxShadow: isOtpVerified ? '0 4px 12px 0 rgba(79, 70, 229, 0.25)' : 'none',
                '&:hover': {
                  boxShadow: isOtpVerified ? '0 6px 16px 0 rgba(79, 70, 229, 0.35)' : 'none',
                }
              }}
            >
              {loading ? 'Creating Account...' : isOtpVerified ? 'Sign Up' : 'Verify Email to Sign Up'}
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

      {/* OTP Verification Modal */}
      <Dialog 
        open={otpModalOpen} 
        onClose={() => setOtpModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1.5,
            width: '100%',
            maxWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Verify Your Email
          <IconButton onClick={() => setOtpModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3, fontSize: '0.875rem' }}>
            We've sent a 6-digit verification code to <strong>{email || 'your email'}</strong>. Please enter it below.
          </DialogContentText>

          {otpError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {otpError}
            </Alert>
          )}

          <TextField
            autoFocus
            required
            fullWidth
            label="Verification Code"
            variant="outlined"
            placeholder="123456"
            value={otpCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, ''); // only allow digits
              if (val.length <= 6) setOtpCode(val);
            }}
            slotProps={{
              htmlInput: {
                maxLength: 6,
                style: { 
                  textAlign: 'center', 
                  fontSize: '1.5rem', 
                  letterSpacing: '0.5rem', 
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }
              }
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
            {resendCountdown > 0 ? (
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Resend code in {resendCountdown}s
              </Typography>
            ) : (
              <Button 
                variant="text" 
                size="small" 
                onClick={handleSendOtp} 
                disabled={otpLoading}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Resend OTP
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setOtpModalOpen(false)} 
            color="inherit" 
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerifyOtp}
            variant="contained"
            disabled={otpLoading || otpCode.length !== 6}
            sx={{ 
              fontWeight: 600, 
              textTransform: 'none',
              px: 3,
              boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.25)',
            }}
          >
            {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
