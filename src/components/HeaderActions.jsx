import { Box, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function HeaderActions() {
  const navigate = useNavigate();
  const { pathname, key } = useLocation();
  const isSettingsPage = pathname === "/settings";

  const handleSettingsClick = () => {
    if (!isSettingsPage) {
      navigate("/settings");
    } else if (key === "default") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        aria-label={isSettingsPage ? "Close settings" : "Settings"}
        color={isSettingsPage ? "primary" : "default"}
        onClick={handleSettingsClick}
      >
        <SettingsIcon />
      </IconButton>
      <NotificationBell />
    </Box>
  );
}

export default HeaderActions;
