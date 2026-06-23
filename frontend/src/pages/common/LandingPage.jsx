import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  const roles = [
    {
      title: "Students",
      description: "Access curated courses, watch interactive lessons, answer quizzes, and track your certification milestones.",
      illustration: (
        <Box sx={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f0f0f2", borderRadius: 3, mb: 3 }}>
          <Box sx={{ position: "relative", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="80" height="80" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#dadce0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                fill="none"
                stroke="#0085e4"
                strokeWidth="3"
                strokeDasharray="75, 100"
              />
            </svg>
            <Box sx={{ position: "absolute", color: "#161637", fontWeight: "bold", fontSize: 16 }}>75%</Box>
          </Box>
        </Box>
      ),
    },
    {
      title: "Trainers",
      description: "Create and publish comprehensive syllabi, grade student homework submissions, and view class analytics.",
      illustration: (
        <Box sx={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f0f0f2", borderRadius: 3, mb: 3, position: "relative", overflow: "hidden" }}>
          <Box sx={{ bgcolor: "#ffffff", borderRadius: "12px", border: "1px solid #dadce0", p: 1.5, display: "flex", gap: 1.5, maxWidth: "90%", alignItems: "center" }}>
            <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#161637", color: "#fafafc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12 }}>TR</Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#161637", fontSize: "11px" }}>Trainer Review</Typography>
              <Typography variant="caption" sx={{ color: "#666666", fontSize: "10px", lineHeight: 1.2 }}>"Excellent course layout and quizzes!"</Typography>
            </Box>
          </Box>
        </Box>
      ),
      isAccent: true, // Swaps to Signal Blue gradient background
    },
    {
      title: "Administrators",
      description: "Manage system access, govern global settings, edit user records, and assign platform moderator roles.",
      illustration: (
        <Box sx={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f0f0f2", borderRadius: 3, mb: 3 }}>
          <Box sx={{ width: 110, height: 74, border: "1px solid #dadce0", borderRadius: 2, bgcolor: "#ffffff", p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ height: 8, bgcolor: "#f0f0f2", borderRadius: 0.5, width: "60%" }} />
            <Box sx={{ height: 5, bgcolor: "#0085e4", borderRadius: 0.5, width: "85%" }} />
            <Box sx={{ height: 5, bgcolor: "#dadce0", borderRadius: 0.5, width: "40%" }} />
            <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
              <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: "#7272fb" }} />
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ height: 5, bgcolor: "#f0f0f2", borderRadius: 0.5 }} />
                <Box sx={{ height: 5, bgcolor: "#f0f0f2", borderRadius: 0.5, width: "70%" }} />
              </Box>
            </Box>
          </Box>
        </Box>
      ),
    },
  ];

  const features = [
    {
      title: "Structured Course Management",
      desc: "Develop comprehensive modules with lessons, quizzes, and syllabus structures designed for designer-focused clarity.",
    },
    {
      title: "Visual Progress Indicators",
      desc: "Track student performance with circular check dials and dynamic progress indicators matching the design system.",
    },
    {
      title: "Central User Roles Governance",
      desc: "Role mappings with specialized dashboards allowing students, trainers, and administrators to access dedicated workspaces.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafc", overflow: "hidden" }}>
      
      {/* Hero Section Banner */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(127deg, #7272fb 0%, #b8e1ff 99%)", // Indigo Wash gradient
          textAlign: "center",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              color: "#ffffff",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              letterSpacing: "-1.4px",
              lineHeight: 1.07,
            }}
          >
            Designers learn here.
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              mb: 5,
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              letterSpacing: "-0.24px",
              lineHeight: 1.42,
            }}
          >
            A minimal, single-ink learning workspace built specifically for designer teams, trainers, and administrators.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 6 }}>
            <Button
              component={Link}
              to={user ? "/dashboard" : "/register"}
              variant="contained"
              sx={{
                bgcolor: "#000000",
                color: "#fafafc",
                padding: "16px 28px",
                fontSize: "15px",
                fontWeight: 600,
                borderRadius: "12px",
                "&:hover": { bgcolor: "#222222" },
              }}
            >
              {user ? "Go to Dashboard" : "Start Learning"}
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                bgcolor: "transparent",
                borderColor: "#ffffff",
                color: "#ffffff",
                padding: "16px 28px",
                fontSize: "15px",
                fontWeight: 600,
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "#ffffff",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>

        {/* Product Window Frame (macOS Chrome Container) */}
        <Container maxWidth="lg" sx={{ mt: 2, mb: -16 }}>
          <Box
            sx={{
              borderRadius: "24px",
              bgcolor: "#ffffff",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 8px 20px -7px",
              border: "1px solid #dadce0",
              overflow: "hidden",
              textAlign: "left",
              mx: "auto",
              width: "90%",
            }}
          >
            {/* Window title bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: 40,
                borderBottom: "1px solid #dadce0",
                px: 2,
                bgcolor: "#fafafc",
              }}
            >
              <Box sx={{ display: "flex", gap: 0.8 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ff5f56" }} />
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ffbd2e" }} />
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#27c93f" }} />
              </Box>
              <Box sx={{ flexGrow: 1, textAlign: "center", pr: 5 }}>
                <Typography variant="caption" sx={{ color: "#666666", fontWeight: 550, fontFamily: "monospace" }}>
                  app.overflow-lms.com
                </Typography>
              </Box>
            </Box>

            {/* Window Content Mockup */}
            <Box sx={{ p: 4, bgcolor: "#fafafc" }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ border: "1px solid #dadce0", borderRadius: 4, p: 3, bgcolor: "#ffffff" }}>
                    <Typography variant="h6" sx={{ color: "#161637", fontWeight: 700, mb: 1 }}>My Courses</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f2", pt: 1.5, mt: 1.5 }}>
                      <Typography variant="body2" sx={{ color: "#666666" }}>UI Design Fundamentals</Typography>
                      <Typography variant="caption" sx={{ color: "#0085e4", fontWeight: 600 }}>80%</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f2", pt: 1.5, mt: 1.5 }}>
                      <Typography variant="body2" sx={{ color: "#666666" }}>Typography Systems</Typography>
                      <Typography variant="caption" sx={{ color: "#0085e4", fontWeight: 600 }}>45%</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ border: "1px solid #dadce0", borderRadius: 4, p: 3, bgcolor: "#ffffff", height: "100%" }}>
                    <Typography variant="h6" sx={{ color: "#161637", fontWeight: 700, mb: 2 }}>Platform Performance Overview</Typography>
                    <Box sx={{ display: "flex", gap: 2, height: 80, alignItems: "flex-end" }}>
                      <Box sx={{ flexGrow: 1, height: "40%", bgcolor: "#dadce0", borderRadius: 0.5 }} />
                      <Box sx={{ flexGrow: 1, height: "70%", bgcolor: "#dadce0", borderRadius: 0.5 }} />
                      <Box sx={{ flexGrow: 1, height: "90%", bgcolor: "#0085e4", borderRadius: 0.5 }} />
                      <Box sx={{ flexGrow: 1, height: "60%", bgcolor: "#dadce0", borderRadius: 0.5 }} />
                      <Box sx={{ flexGrow: 1, height: "80%", bgcolor: "#161637", borderRadius: 0.5 }} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Spacer to handle the negative margin overlap of product mockup */}
      <Box sx={{ height: { xs: 120, md: 160 } }} />

      {/* Trust Logo Bar */}
      <Box sx={{ py: 6, bgcolor: "#fafafc", borderBottom: "1px solid #dadce0" }}>
        <Typography align="center" variant="caption" sx={{ display: "block", color: "#666666", mb: 3, fontWeight: 550, textTransform: "uppercase", letterSpacing: "1.2px" }}>
          Trusted by designers at the world's most thoughtful teams
        </Typography>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", alignItems: "center", gap: 4 }}>
            {["Figma", "Framer", "Webflow", "InVision", "Linear"].map((logo) => (
              <Typography
                key={logo}
                variant="h5"
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 800,
                  color: "#000000",
                  opacity: 0.65,
                  letterSpacing: "-0.8px",
                }}
              >
                {logo}
              </Typography>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Grid Section (Flush-left section headings) */}
      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Box sx={{ mb: 8, textAlign: "left" }}>
          <Typography
            variant="h2"
            sx={{
              color: "#161637",
              fontWeight: 700,
              letterSpacing: "-1px",
              mb: 2,
            }}
          >
            Built for Everyone.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {roles.map((role) => (
            <Grid size={{ xs: 12, md: 4 }} key={role.title}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  bgcolor: role.isAccent ? "transparent" : "#fafafc",
                  background: role.isAccent ? "linear-gradient(90deg, #007bff 0%, #62aeff 100%)" : "none", // Signal Blue gradient card
                  borderColor: role.isAccent ? "transparent" : "#dadce0",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  p: 1,
                  color: role.isAccent ? "#ffffff" : "#161637",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {role.illustration}
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: role.isAccent ? "#ffffff" : "#161637",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    {role.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: role.isAccent ? "rgba(255, 255, 255, 0.9)" : "#666666",
                      lineHeight: 1.57,
                      fontSize: "14px",
                    }}
                  >
                    {role.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Platform Features Section */}
      <Box sx={{ bgcolor: "#f0f0f2", py: { xs: 10, md: 14 } }}>
        <Container>
          <Box sx={{ mb: 8, textAlign: "left" }}>
            <Typography
              variant="h3"
              sx={{
                color: "#161637",
                fontWeight: 700,
                letterSpacing: "-0.6px",
                mb: 2,
              }}
            >
              Discover your new learning superpowers.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feat) => (
              <Grid size={{ xs: 12, md: 4 }} key={feat.title}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: "24px",
                    bgcolor: "#fafafc",
                    border: "1px solid #dadce0",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#161637",
                      fontWeight: 700,
                      mb: 2,
                      letterSpacing: "-0.4px",
                    }}
                  >
                    {feat.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      lineHeight: 1.57,
                    }}
                  >
                    {feat.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4}>
          {[
            { stat: "10K+", desc: "Active Students" },
            { stat: "500+", desc: "Expert Trainers" },
            { stat: "120+", desc: "Courses Available" },
          ].map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.desc}>
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  border: "1px solid #dadce0",
                  borderRadius: "24px",
                  bgcolor: "#fafafc",
                }}
              >
                <Typography variant="h2" sx={{ color: "#161637", mb: 1, fontWeight: 700, letterSpacing: "-1px" }}>
                  {item.stat}
                </Typography>
                <Typography sx={{ color: "#666666", fontWeight: 550, fontSize: "14px", letterSpacing: "-0.08px" }}>
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          textAlign: "center",
          bgcolor: "#161637", // Midnight Ink dark base
          color: "#fafafc",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              color: "#fafafc",
              fontWeight: 700,
              letterSpacing: "-1px",
              mb: 3,
            }}
          >
            Ready to transform learning?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 5,
              opacity: 0.9,
              maxWidth: 500,
              mx: "auto",
              color: "#fafafc",
              lineHeight: 1.6,
            }}
          >
            Join thousands of designer-focused users leveling up their workflows on Overflow LMS today.
          </Typography>

          <Button
            component={Link}
            to={user ? "/dashboard" : "/register"}
            variant="contained"
            sx={{
              bgcolor: "#fafafc",
              color: "#161637",
              px: 4,
              py: 2,
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "12px",
              "&:hover": {
                bgcolor: "#e2e8f0",
              },
            }}
          >
            {user ? "Go to Dashboard" : "Get Started Today"}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}