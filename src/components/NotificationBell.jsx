import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import useAppData from "../hooks/useAppData";
import { formatDate } from "../utils/formatters";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function NotificationBell() {
  const { notifications, markAllNotificationsRead, clearNotifications } =
    useAppData();
  const [anchorEl, setAnchorEl] = useState(null);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    event.currentTarget.blur();
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (unreadCount > 0) markAllNotificationsRead();
  };

  return (
    <>
      <IconButton aria-label="Notifications" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error" max={9}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: { xs: 290, md: 340 }, mt: 1 } } }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.25,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography fontWeight={600}>Notifications</Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={clearNotifications}>
              Clear all
            </Button>
          )}
        </Box>

        {notifications.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ p: 2, fontSize: "0.875rem" }}
          >
            Nothing new yet. We'll tell you when you reach a goal or a jar runs
            low.
          </Typography>
        ) : (
          <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
            {notifications.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  bgcolor: item.read ? "transparent" : "action.hover",
                }}
              >
                {item.type === "jar" ? (
                  <WarningAmberIcon
                    fontSize="small"
                    sx={{ color: "error.main", mt: 0.25 }}
                  />
                ) : (
                  <EmojiEventsIcon
                    fontSize="small"
                    sx={{ color: "warning.main", mt: 0.25 }}
                  />
                )}
                <Box>
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    {item.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(item.createdAt)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Popover>
    </>
  );
}

export default NotificationBell;
