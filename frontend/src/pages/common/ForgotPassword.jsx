import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import API from '../../api/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [activeStep, setActiveStep] = useState(1); // 1 = Email, 2 = OTP Code, 3 = New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const navigate = useNavigate();

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Step 1: Send OTP code
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await API.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setActiveStep(2);
        setResendCountdown(30);
      } else {
        setError(response.data.message || 'Failed to send verification code.');
        // For testing/fallback support in dev:
        setActiveStep(2);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error requesting code. Please verify the email or backend connection.';
      setError(errMsg);
      // Fallback transition for testing UI flows
      setActiveStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await API.post('/auth/verify-otp', { email, otp: otpCode });
      if (response.data.success) {
        setActiveStep(3);
      } else {
        setError(response.data.message || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Verification failed. Please check the code or backend connection.';
      setError(errMsg);
      // Fallback transition to let user test Step 3 if backend is not fully setup
      setActiveStep(3);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await API.post('/auth/reset-password', { email, otp: otpCode, password });
      if (response.data.success) {
        alert('Password reset successfully! Redirecting to login...');
        navigate('/login');
      } else {
        setError(response.data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Password reset failed. Please check backend connection.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Logo/Icon */}
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
            <KeyIcon fontSize="medium" />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
            {activeStep === 1 && 'Forgot Password'}
            {activeStep === 2 && 'Enter Code'}
            {activeStep === 3 && 'New Password'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {activeStep === 1 && "Enter your email to receive a password reset OTP"}
            {activeStep === 2 && `We've sent a 6-digit verification code to ${email}`}
            {activeStep === 3 && "Set your new account password below"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left', borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Step 1: Send OTP Form */}
          {activeStep === 1 && (
            <Box component="form" onSubmit={handleSendOtp} noValidate sx={{ width: '100%' }}>
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
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, mb: 3 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Code'}
              </Button>
            </Box>
          )}

          {/* Step 2: Verify OTP Form */}
          {activeStep === 2 && (
            <Box component="form" onSubmit={handleVerifyOtp} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otpCode"
                label="Verification Code"
                placeholder="123456"
                name="otpCode"
                autoFocus
                value={otpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ''); // digits only
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

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                {resendCountdown > 0 ? (
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Resend code in {resendCountdown}s
                  </Typography>
                ) : (
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={handleSendOtp}
                    disabled={loading}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Resend Code
                  </Button>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || otpCode.length !== 6}
                sx={{ py: 1.5, mb: 3 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code'}
              </Button>
            </Box>
          )}

          {/* Step 3: New Password Form */}
          {activeStep === 3 && (
            <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
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
                disabled={loading}
                sx={{ py: 1.5, mb: 3 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
              </Button>
            </Box>
          )}

          {/* Navigation Back to Login */}
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button 
              component={Link} 
              to="/login" 
              color="inherit" 
              startIcon={<ArrowBackIcon />}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' }}
            >
              Back to Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
