import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import ConfirmDialog from "../components/ConfirmDialog";
import ManageJarsDialog from "../components/ManageJarDialog";
import useAppData from "../hooks/useAppData";
import defaultJars from "../utils/defaultJars";
import { Avatar } from "@mui/material";
import useAuth from "../hooks/useAuth";

function SettingsRow({ title, description, actionLabel, color, onClick }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        py: 2,
      }}
    >
      <Box>
        <Typography fontWeight={600}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        size="small"
        color={color}
        onClick={onClick}
        sx={{ flexShrink: 0 }}
      >
        {actionLabel}
      </Button>
    </Box>
  );
}

function Settings() {
  const { resetJarSettings, resetAllData } = useAppData();
  const { user, logout } = useAuth();
  const [manageOpen, setManageOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const defaultSplit = defaultJars.map((jar) => `${jar.percent}%`).join(" / ");

  const openDialog = (setOpen) => (event) => {
    event.currentTarget.blur();
    setOpen(true);
  };

  return (
    <>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}
          >
            <Avatar src={user.photoURL} alt={user.displayName}>
              {user.displayName?.[0]}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={600} noWrap>
                {user.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Button variant="outlined" size="small" onClick={logout}>
            Log out
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ px: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ pt: 2 }}>
          Jars
        </Typography>
        <SettingsRow
          title="Jar split and limits"
          description="Choose what percent of every income goes into each jar, and each jar's limit."
          actionLabel="Edit"
          onClick={openDialog(setManageOpen)}
        />
        <Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />
        <SettingsRow
          title="Restore default split"
          description={`Go back to ${defaultSplit} and the default limits. Your balances stay the same.`}
          actionLabel="Restore"
          onClick={openDialog(setRestoreOpen)}
        />
      </Paper>

      <Paper variant="outlined" sx={{ px: { xs: 2, md: 3 } }}>
        <Typography variant="h6" fontWeight={600} sx={{ pt: 2 }}>
          Data
        </Typography>
        <SettingsRow
          title="Reset all data"
          description="Deletes all transactions, goals and notifications, and empties every jar. This can't be undone."
          actionLabel="Reset"
          color="error"
          onClick={openDialog(setResetOpen)}
        />
      </Paper>

      {manageOpen && <ManageJarsDialog onClose={() => setManageOpen(false)} />}

      {restoreOpen && (
        <ConfirmDialog
          title="Restore default split?"
          message={`Your jars will go back to ${defaultSplit}. Balances and transactions are not changed.`}
          confirmLabel="Restore"
          confirmColor="primary"
          onConfirm={() => {
            resetJarSettings();
            setRestoreOpen(false);
          }}
          onClose={() => setRestoreOpen(false)}
        />
      )}

      {resetOpen && (
        <ConfirmDialog
          title="Reset all data?"
          message="Everything you have entered will be deleted, and your jars will be empty. This can't be undone."
          confirmLabel="Reset everything"
          onConfirm={() => {
            resetAllData();
            setResetOpen(false);
          }}
          onClose={() => setResetOpen(false)}
        />
      )}
    </>
  );
}

export default Settings;
