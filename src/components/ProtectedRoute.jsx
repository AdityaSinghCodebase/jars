import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import useAuth from "../hooks/useAuth";
import { AppDataProvider } from "../context/AppDataContext";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppDataProvider key={user.uid}>
      <Outlet />
    </AppDataProvider>
  );
}

export default ProtectedRoute;
