import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Divider,
  useTheme,
  useMediaQuery,
  Drawer
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExploreIcon from '@mui/icons-material/Explore';
import SchoolIcon from '@mui/icons-material/School';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Persist sidebar collapse state in localStorage (desktop only)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('student_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      localStorage.setItem('student_sidebar_collapsed', !prev);
      return !prev;
    });
  };

  const handleLogout = () => {
    logoutUser();
    alert('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Overview', path: '/dashboard/student', icon: <DashboardIcon />, exact: true },
    { text: 'Course Catalog', path: '/dashboard/student/catalog', icon: <ExploreIcon />, exact: false },
    { text: 'My Courses', path: '/dashboard/student/courses', icon: <SchoolIcon />, exact: false },
  ];

  const renderSidebarContent = () => (
    <Box
      sx={{
        width: isMobile ? 260 : (isCollapsed ? 72 : 260),
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: (isMobile || !isCollapsed) ? 'space-between' : 'center', height: 64 }}>
        {(isMobile || !isCollapsed) && (
          <Typography variant="h6" sx={{ color: '#161637', fontWeight: 700, letterSpacing: '-0.4px' }}>
            Student Hub
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={toggleSidebar} size="small" sx={{ color: '#666666' }}>
            {isCollapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
          </IconButton>
        )}
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} size="small" sx={{ color: '#666666' }}>
            <MenuOpenIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ borderColor: '#dadce0', mb: 2 }} />

      {/* Menu Items List */}
      <List sx={{ flexGrow: 1, px: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.exact}
              onClick={() => {
                if (isMobile) setMobileOpen(false);
              }}
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#f0f0f2' : 'transparent',
                color: isActive ? '#161637' : '#666666',
                borderRadius: '8px',
              })}
              sx={{
                minHeight: 48,
                justifyContent: (!isMobile && isCollapsed) ? 'center' : 'initial',
                px: 2.5,
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#f0f0f2',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: (!isMobile && isCollapsed) ? 'auto' : 3,
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {(isMobile || !isCollapsed) && (
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '-0.08px'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: '#dadce0', mt: 'auto' }} />

      {/* Sidebar Footer User Info and Logout */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {(isMobile || !isCollapsed) && (
          <Box sx={{ px: 1, mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#666666', fontWeight: 550, display: 'block' }}>
              LOGGED IN AS
            </Typography>
            <Typography variant="body2" sx={{ color: '#161637', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username}
            </Typography>
          </Box>
        )}
        <Button
          variant="outlined"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            width: '100%',
            justifyContent: (!isMobile && isCollapsed) ? 'center' : 'flex-start',
            padding: (!isMobile && isCollapsed) ? '8px' : '10px 16px',
            borderRadius: '8px',
            minWidth: 0,
            '& .MuiButton-startIcon': {
              marginRight: (!isMobile && isCollapsed) ? 0 : 1.5,
              marginLeft: 0
            }
          }}
        >
          {(isMobile || !isCollapsed) && 'Logout'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)', bgcolor: '#fafafc' }}>
      
      {/* Desktop Sidebar Drawer Container */}
      {!isMobile && (
        <Box
          sx={{
            width: isCollapsed ? 72 : 260,
            borderRight: '1px solid #dadce0',
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {renderSidebarContent()}
        </Box>
      )}

      {/* Mobile Sidebar Temporary Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, borderRight: '1px solid #dadce0' },
          }}
        >
          {renderSidebarContent()}
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: { xs: 2.5, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1.5, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #dadce0' }}>
            <IconButton onClick={() => setMobileOpen(true)} edge="start" sx={{ color: '#161637', mr: 1.5 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle2" sx={{ color: '#161637', fontWeight: 700, letterSpacing: '-0.16px' }}>
              Student Menu
            </Typography>
          </Box>
        )}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>

    </Box>
  );
}
