import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#4F46E5" },
    secondary: { main: "#10B981" },
    background: { default: "#F5F7FB", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 8 },
});

export default theme;
