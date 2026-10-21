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

function getInitialForm(transaction) {
  if (!transaction) return initialForm;

  return {
    type: transaction.type,
    amount: String(transaction.amount),
    note: transaction.note ?? "",
    jarId: transaction.jarId ?? "enjoy-today",
  };
}

function AddTransactionDialog({ open, onClose, transaction }) {
  const { jars, addTransaction, updateTransaction } = useAppData();
  const [form, setForm] = useState(() => getInitialForm(transaction));

  const isEditing = Boolean(transaction);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    const details = {
      amount: Number(form.amount),
      note: form.note.trim(),
      jarId: form.type === "expense" ? form.jarId : null,
    };

    if (isEditing) {
      updateTransaction(transaction.id, details);
    } else {
      addTransaction({ type: form.type, ...details });
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { component: "form", onSubmit: handleSubmit } }}
    >
      <DialogTitle>
        {isEditing ? "Edit transaction" : "Add transaction"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {!isEditing && (
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
          )}

          <TextField
            autoFocus
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
        <Button type="submit" variant="contained" disabled={!isValid}>
          {isEditing ? "Save changes" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTransactionDialog;
