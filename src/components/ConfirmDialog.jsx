import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { component: "form", onSubmit: handleSubmit } }}
      sx={{ "& .MuiDialog-paper": { m: { xs: 2, md: 4 } } }}
    >
      <DialogTitle sx={{ fontSize: { xs: "1.05rem", md: "1.25rem" } }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, md: 3 } }}>
        <DialogContentText sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, md: 3 } }}>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          type="submit"
          color="error"
          variant="contained"
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
