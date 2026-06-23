import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
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
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Left Gradient Panel — desktop only */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          background: 'linear-gradient(145deg, #161637 0%, #1e1e50 40%, #0085e4 100%)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: 8,
          py: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
        <Box sx={{ position: 'absolute', top: '40%', right: '20%', width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(0,133,228,0.15)' }} />

        <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 800, mb: 2, letterSpacing: '-0.6px', lineHeight: 1.2 }}>
          Start your learning<br />journey today
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 360, lineHeight: 1.7, mb: 4 }}>
          Create your free account and get instant access to structured courses, expert instructors, and a thriving learning community.
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {['Free Access', 'Verified Certs', 'Learn Anytime'].map((stat) => (
            <Box key={stat} sx={{ px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 600, fontSize: '12px' }}>
                {stat}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Form Panel */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 6, md: 4 }, px: { xs: 2, sm: 4 } }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
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
              bgcolor: '#161637', 
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
            Create Account
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666666', 
              mb: 4,
              letterSpacing: '-0.08px'
            }}
          >
            Join Overflow LMS today
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              placeholder="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1, mb: 1, width: '100%' }}>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="Email Address"
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
                onClick={handleSendOtp}
                disabled={isOtpVerified || !email}
                sx={{ 
                  height: '48px', 
                  minWidth: '100px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  fontSize: '14px',
                  p: '0 16px',
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
              placeholder="Password"
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
              placeholder="Confirm Password"
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
              disabled={loading || !isOtpVerified}
              sx={{ 
                py: 1.8, 
                mb: 3, 
              }}
            >
              {loading ? 'Creating Account...' : isOtpVerified ? 'Sign Up' : 'Verify Email to Sign Up'}
            </Button>

            <Typography variant="body2" sx={{ color: '#666666' }}>
              Already have an account?{' '}
              <Typography 
                variant="body2" 
                component={Link} 
                to="/login" 
                sx={{ 
                  color: '#0085e4', 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  letterSpacing: '-0.08px',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
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
            borderRadius: '24px',
            border: '1px solid #dadce0',
            p: 2,
            width: '100%',
            maxWidth: '400px',
            bgcolor: '#fafafc',
            boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 20px -7px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#161637', pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Verify Your Email
          <IconButton onClick={() => setOtpModalOpen(false)} size="small" sx={{ color: '#666666' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText sx={{ mb: 3, fontSize: '14px', color: '#666666', lineHeight: 1.57 }}>
            We've sent a 6-digit verification code to <strong>{email || 'your email'}</strong>. Please enter it below.
          </DialogContentText>

          {otpError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {otpError}
            </Alert>
          )}

          <TextField
            autoFocus
            required
            fullWidth
            variant="outlined"
            placeholder="Verification Code"
            value={otpCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, ''); 
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
                  fontWeight: 'bold',
                  color: '#000000'
                }
              }
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
            {resendCountdown > 0 ? (
              <Typography variant="caption" sx={{ color: '#666666', fontWeight: 500 }}>
                Resend code in {resendCountdown}s
              </Typography>
            ) : (
              <Button 
                variant="text" 
                size="small" 
                onClick={handleSendOtp} 
                disabled={otpLoading}
                sx={{ textTransform: 'none', fontWeight: 600, p: 0, minWidth: 'auto' }}
              >
                Resend OTP
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button 
            onClick={() => setOtpModalOpen(false)} 
            sx={{ fontWeight: 600, color: '#666666', textTransform: 'none' }}
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
              borderRadius: '12px'
            }}
          >
            {otpLoading ? <CircularProgress size={20} color="inherit" /> : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
        </Box>
      </Box>
    </Box>
  );
}
