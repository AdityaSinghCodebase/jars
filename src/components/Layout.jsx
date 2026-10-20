import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  Fab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import navItems from "../utils/navItems";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AddTransactionDialog from "./AddTransactionDialog";
import AddGoalDialog from "./AddGoalDialog";

const DRAWER_WIDTH = 240;

function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isGoalsPage = pathname === "/goals";
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (event) => {
    event.currentTarget.blur();
    setDialogOpen(true);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              p: 2,
            },
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            color="primary"
            sx={{ mb: 3, px: 1 }}
          >
            Jars
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 4 },
          pb: { xs: 10, md: 4 },
        }}
      >
        <Outlet />
      </Box>

      {isMobile && (
        <Paper
          elevation={3}
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        >
          <BottomNavigation
            showLabels
            value={pathname}
            onChange={(event, newPath) => navigate(newPath)}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                value={item.path}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
      <Fab
        color="primary"
        aria-label={isGoalsPage ? "Add goal" : "Add transaction"}
        onClick={() => setDialogOpen(true)}
        sx={{ position: "fixed", right: 24, bottom: { xs: 88, md: 32 } }}
      >
        <AddIcon />
      </Fab>

      {isGoalsPage ? (
        dialogOpen && <AddGoalDialog onClose={() => setDialogOpen(false)} />
      ) : (
        <AddTransactionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Box>
  );
}

export default Layout;
