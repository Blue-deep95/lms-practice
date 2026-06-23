import { Box, Container, Typography, Avatar, Chip, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';

const technologies = [
  'React',
  'Material UI (MUI v5)',
  'React Router v6',
  'Context API',
  'Vite',
  'Node.js',
  'Express.js',
  'MongoDB',
  'Mongoose',
  'JWT Authentication'
];

export default function About() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Hero Header Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 6,
          p: 6,
          borderRadius: '32px',
          background: 'linear-gradient(135deg, #161637 0%, #0d0d21 100%)',
          color: '#fafafc',
          boxShadow: 'rgba(22, 22, 55, 0.15) 0px 20px 40px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            letterSpacing: '-1px', 
            mb: 2,
            background: 'linear-gradient(90deg, #ffffff 0%, #0085e4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          About Overflow LMS
        </Typography>
        
        {/* Creator Info */}
        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 2,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50px',
            py: 1.5,
            px: 3,
            mt: 1
          }}
        >
          <Avatar sx={{ bgcolor: '#0085e4', width: 40, height: 40 }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Created By
            </Typography>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 650, fontSize: '0.95rem' }}>
              Phani deep k
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content & Description */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 5, 
          borderRadius: '24px', 
          border: '1px solid #dadce0', 
          bgcolor: '#ffffff',
          textAlign: 'left'
        }}
      >
        <Typography variant="h5" sx={{ color: '#161637', fontWeight: 700, mb: 2.5 }}>
          The Platform
        </Typography>
        
        <Typography variant="body1" sx={{ color: '#666666', mb: 3, lineHeight: 1.7 }}>
          Overflow LMS is a streamlined Learning Management System designed to deliver clear and intuitive course outlines, curriculum progress, and interactive lecture contents. The application features user roles tailored for Students (for consuming lectures), Trainers (for creating and arranging topics), and Admins (for platform-wide system management).
        </Typography>

        <Typography variant="body1" sx={{ color: '#666666', mb: 4, lineHeight: 1.7 }}>
          Built as a modern web application, the backend runs on Express and Node.js connected to a MongoDB database, utilizing HTTP-only cookie-based JWT sessions for security. The client-side is structured with React and styled with Material UI, implementing responsive dashboard layouts, custom routing logic, and media embed APIs that support both YouTube and Google Drive video files.
        </Typography>

        <Box sx={{ borderTop: '1px solid #dadce0', pt: 3.5 }}>
          <Typography variant="body2" sx={{ color: '#161637', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon sx={{ fontSize: 20, color: '#0085e4' }} /> Technologies Used
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
            {technologies.map((tech) => (
              <Chip 
                key={tech} 
                label={tech} 
                size="small"
                sx={{ 
                  bgcolor: 'rgba(0, 133, 228, 0.06)', 
                  color: '#0085e4', 
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  border: '1px solid rgba(0, 133, 228, 0.1)',
                  borderRadius: '6px',
                  py: 1.5,
                  px: 0.5
                }} 
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
