import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import AddTransactionDialog from "./AddTransactionDialog";
import AddGoalDialog from "./AddGoalDialog";
import Logo from "./Logo";
import HeaderActions from "./HeaderActions";
import navItems from "../utils/navItems";

const DRAWER_WIDTH = 240;

function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const isGoalsPage = pathname === "/goals";

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              px: 1,
              pt: 0.5,
            }}
          >
            <Logo />
            <HeaderActions />
          </Box>
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

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {isMobile && (
          <Box
            component="header"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: theme.zIndex.appBar,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Logo size={32} />
            <HeaderActions />
          </Box>
        )}

        <Box
          component="main"
          sx={{ p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}
        >
          <Outlet />
        </Box>
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
        onClick={handleOpenDialog}
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
