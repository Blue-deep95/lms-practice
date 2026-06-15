import { Container, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';

export default function ForgotPassword() {
  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
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
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            This is a dummy page for resetting your password.
          </Typography>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
