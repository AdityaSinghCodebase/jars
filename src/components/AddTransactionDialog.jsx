import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import useAppData from "../hooks/useAppData";

const initialForm = {
  type: "expense",
  amount: "",
  note: "",
  jarId: "enjoy-today",
};

function AddTransactionDialog({ open, onClose }) {
  const { jars, addTransaction } = useAppData();
  const [form, setForm] = useState(initialForm);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setForm((previous) => ({ ...previous, type: newType }));
    }
  };

  const isValid =
    Number(form.amount) > 0 && (form.type === "income" || form.jarId !== "");

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = () => {
    addTransaction({
      type: form.type,
      amount: Number(form.amount),
      note: form.note.trim(),
      jarId: form.type === "expense" ? form.jarId : null,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add transaction</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <ToggleButtonGroup
            value={form.type}
            exclusive
            fullWidth
            color="primary"
            onChange={handleTypeChange}
          >
            <ToggleButton value="expense">Expense</ToggleButton>
            <ToggleButton value="income">Income</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={handleChange("amount")}
            fullWidth
          />

          {form.type === "expense" && (
            <TextField
              select
              label="Take from jar"
              value={form.jarId}
              onChange={handleChange("jarId")}
              fullWidth
              slotProps={{ select: { MenuProps: { disablePortal: true } } }}
            >
              {jars.map((jar) => (
                <MenuItem key={jar.id} value={jar.id}>
                  {jar.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Note (optional)"
            value={form.note}
            onChange={handleChange("note")}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTransactionDialog;
