import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Box, Button, Avatar, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Map roles to nice colored badges matching design system aesthetics
  const getRoleChip = (role) => {
    switch (role) {
      case 'admin':
        return <Chip label="Administrator" color="error" size="small" sx={{ fontWeight: 600, borderRadius: '8px' }} />;
      case 'trainer':
        return <Chip label="Trainer" color="secondary" size="small" sx={{ fontWeight: 600, borderRadius: '8px' }} />;
      default:
        return <Chip label="Student" color="primary" size="small" sx={{ fontWeight: 600, borderRadius: '8px' }} />;
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
          {/* Avatar Icon */}
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: '#161637', 
              color: '#fafafc', 
              mx: 'auto', 
              mb: 3,
              boxShadow: '0 4px 12px rgba(22, 22, 55, 0.2)'
            }}
          >
            <PersonIcon sx={{ fontSize: 36 }} />
          </Avatar>

          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1, 
              color: '#161637',
              letterSpacing: '-0.4px'
            }}
          >
            My Profile
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666666', 
              mb: 4,
              letterSpacing: '-0.08px'
            }}
          >
            View and manage your account details
          </Typography>

          {/* User details */}
          <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PersonIcon sx={{ color: '#161637', opacity: 0.8 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#999999', display: 'block', fontWeight: 550 }}>
                  Username
                </Typography>
                <Typography variant="body1" sx={{ color: '#161637', fontWeight: 600 }}>
                  {user.username}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <EmailIcon sx={{ color: '#161637', opacity: 0.8 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#999999', display: 'block', fontWeight: 550 }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ color: '#161637', fontWeight: 600 }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BadgeIcon sx={{ color: '#161637', opacity: 0.8 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#999999', display: 'block', fontWeight: 550 }}>
                  Platform Role
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {getRoleChip(user.role)}
                </Box>
              </Box>
            </Box>
          </Box>

          <Button 
            component={Link} 
            to="/dashboard" 
            fullWidth
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              py: 1.5,
              textTransform: 'none', 
              fontWeight: 600, 
              fontSize: '0.875rem'
            }}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
