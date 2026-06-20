import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutUser();
    handleMenuClose();
    alert('Logged out successfully');
    navigate('/login');
  };

  const handleDashboardClick = () => {
    handleMenuClose();
    navigate('/dashboard');
  };

  return (
    <AppBar 
      position="static" 
      color="inherit" 
      elevation={0}
      sx={{
        bgcolor: '#ffffff', // Pure White surface to separate from background canvas
        borderBottom: '1px solid #dadce0', // Hairline separation
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)', // Very subtle shadow for depth
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 64 }}>
          {/* Logo Left */}
          <Typography 
            variant="h6" 
            component={Link}
            to="/"
            sx={{ 
              color: '#161637', // Midnight Ink
              fontWeight: 800, 
              fontSize: '1.25rem', // 20px
              letterSpacing: '-0.24px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Overflow <Box component="span" sx={{ color: '#0085e4', ml: 0.5, fontWeight: 800 }}>LMS</Box>
          </Typography>

          {/* Links Middle - Desktop only */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {user && (
                <Button
                  component={Link}
                  to="/dashboard"
                  sx={{
                    color: '#666666',
                    fontSize: '15px',
                    fontWeight: 500,
                    letterSpacing: '-0.12px',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': { color: '#161637', bgcolor: 'transparent' }
                  }}
                >
                  Dashboard
                </Button>
              )}
            </Box>
          )}

          {/* Action elements Right - Responsive */}
          {isMobile ? (
            <Box>
              <IconButton
                onClick={handleMenuOpen}
                edge="end"
                sx={{ color: '#161637' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1.5,
                      borderRadius: '16px',
                      border: '1px solid #dadce0',
                      boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 16px -8px',
                      width: 200,
                      bgcolor: '#ffffff'
                    }
                  }
                }}
              >
                {user ? [
                  <MenuItem key="user" component={Link} to="/profile" onClick={handleMenuClose} sx={{ color: '#161637', fontWeight: 600 }}>
                    Hi, {user.username}
                  </MenuItem>,
                  <Divider key="div1" sx={{ borderColor: '#dadce0', my: 1 }} />,
                  <MenuItem key="dashboard" onClick={handleDashboardClick} sx={{ fontWeight: 500, color: '#666666' }}>
                    Dashboard
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout} sx={{ fontWeight: 600, color: '#d32f2f' }}>
                    Logout
                  </MenuItem>
                ] : [
                  <MenuItem key="login" component={Link} to="/login" onClick={handleMenuClose} sx={{ fontWeight: 500, color: '#666666' }}>
                    Login
                  </MenuItem>,
                  <MenuItem key="register" component={Link} to="/register" onClick={handleMenuClose} sx={{ fontWeight: 600, color: '#0085e4' }}>
                    Get Started
                  </MenuItem>
                ]}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {user ? (
                <>
                  <Typography 
                    component={Link} 
                    to="/profile" 
                    variant="body2" 
                    sx={{ 
                      color: '#666666', 
                      fontSize: '14px', 
                      letterSpacing: '-0.08px', 
                      textDecoration: 'none', 
                      '&:hover span': { color: '#0085e4' } 
                    }}
                  >
                    Hello, <span style={{ fontWeight: 600, color: '#161637', transition: 'color 0.2s' }}>{user.username}</span>
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={handleLogout}
                    sx={{
                      padding: '8px 16px',
                      fontSize: '14px',
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    component={Link}
                    to="/login"
                    sx={{ 
                      color: '#666666', 
                      fontSize: '15px',
                      fontWeight: 500,
                      letterSpacing: '-0.12px',
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': { color: '#161637', bgcolor: 'transparent' }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    component={Link}
                    to="/register"
                    sx={{
                      padding: '10px 20px',
                      fontSize: '15px',
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
