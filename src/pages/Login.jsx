import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";

function Login() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSignIn = async () => {
    setError("");
    setSigningIn(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Could not sign in. Please try again.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 380,
          p: { xs: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Logo size={52} />
        </Box>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Split every income into jars. Spend with a plan.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={handleSignIn}
          disabled={signingIn}
        >
          {signingIn ? "Signing in..." : "Continue with Google"}
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;
