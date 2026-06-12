import React from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";



export default function LandingPage() {
  const roles = [
    {
      title: "Students",
      icon: <SchoolIcon fontSize="large" />,
      description:
        "Access courses, track progress, complete assignments and earn certifications.",
    },
    {
      title: "Trainers",
      icon: <FitnessCenterIcon fontSize="large" />,
      description:
        "Create courses, manage students, upload content and monitor performance.",
    },
    {
      title: "Admins",
      icon: <AdminPanelSettingsIcon fontSize="large" />,
      description:
        "Manage users, oversee platform operations and generate reports.",
    },
  ];

  const features = [
    "Course Management",
    "Progress Tracking",
    "Assignment Submission",
    "Trainer Dashboards",
    "Attendance Monitoring",
    "Analytics & Reporting",
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>

        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 10, md: 14 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.04) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 10% 80%, rgba(14, 165, 233, 0.04) 0%, rgba(255, 255, 255, 0) 50%)',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" gutterBottom sx={{ color: 'text.primary' }}>
              Learning Management Platform
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 5, maxWidth: 640, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}
            >
              Empower students, trainers, and administrators with one
              centralized learning ecosystem.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  boxShadow: '0 4px 12px 0 rgba(79, 70, 229, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 16px 0 rgba(79, 70, 229, 0.3)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Start Learning
              </Button>

              <Button 
                size="large" 
                variant="outlined" 
                color="primary"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'rgba(79, 70, 229, 0.02)',
                  }
                }}
              >
                Book Demo
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Roles */}
        <Container sx={{ py: { xs: 8, md: 10 } }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 6, color: 'text.primary' }}
          >
            Built For Everyone
          </Typography>

          <Grid container spacing={4}>
            {roles.map((role, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={role.title}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: "100%", 
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 24px -8px rgba(15, 23, 42, 0.05)',
                      borderColor: 'primary.light',
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 6, px: 3 }}>
                    <Box 
                      sx={{ 
                        width: 68, 
                        height: 68, 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        mx: 'auto', 
                        mb: 3,
                        bgcolor: index === 0 ? 'rgba(79, 70, 229, 0.08)' : index === 1 ? 'rgba(14, 165, 233, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                        color: index === 0 ? 'primary.main' : index === 1 ? 'secondary.main' : '#10b981',
                      }}
                    >
                      {role.icon}
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{ mb: 2, color: 'text.primary' }}
                    >
                      {role.title}
                    </Typography>

                    <Typography color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {role.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Features */}
        <Box sx={{ bgcolor: "#f8fafc", py: { xs: 8, md: 10 }, borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <Container>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ mb: 6, color: 'text.primary' }}
            >
              Platform Features
            </Typography>

            <Grid container spacing={3}>
              {features.map((feature) => (
                <Grid size={{ xs: 12, md: 4 }} key={feature}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3.5,
                      textAlign: "center",
                      border: '1px solid #e2e8f0',
                      bgcolor: '#ffffff',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px -6px rgba(79, 70, 229, 0.1)',
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', color: 'text.primary' }}>
                      {feature}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Statistics */}
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 5, 
                  textAlign: "center",
                  border: '1px solid #f1f5f9',
                  bgcolor: '#ffffff'
                }}
              >
                <Typography variant="h3" sx={{ color: 'primary.main', mb: 1, fontWeight: 800 }}>
                  10K+
                </Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                  Active Students
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 5, 
                  textAlign: "center",
                  border: '1px solid #f1f5f9',
                  bgcolor: '#ffffff'
                }}
              >
                <Typography variant="h3" sx={{ color: 'secondary.main', mb: 1, fontWeight: 800 }}>
                  500+
                </Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                  Expert Trainers
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 5, 
                  textAlign: "center",
                  border: '1px solid #f1f5f9',
                  bgcolor: '#ffffff'
                }}
              >
                <Typography variant="h3" sx={{ color: 'primary.main', mb: 1, fontWeight: 800 }}>
                  120+
                </Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                  Courses Available
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* CTA */}
        <Box
          sx={{
            py: { xs: 10, md: 12 },
            textAlign: "center",
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            color: "white",
            position: 'relative',
          }}
        >
          {/* Subtle light overlay for background depth */}
          <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle, #ffffff 10%, transparent 11%)', backgroundSize: '12px 12px', zIndex: 0 }} />
          
          <Container sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ mb: 2 }}
            >
              Ready To Transform Learning?
            </Typography>

            <Typography sx={{ mb: 5, opacity: 0.9, maxWidth: 540, mx: 'auto' }}>
              Join thousands of students and trainers using our platform.
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 5,
                py: 1.8,
                bgcolor: '#ffffff',
                color: 'primary.main',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: '#f8fafc',
                  color: 'primary.dark',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              Get Started Today
            </Button>
          </Container>
        </Box>
    </Box>
  );
}