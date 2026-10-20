import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import useAppData from "../hooks/useAppData";
import { formatCurrency } from "../utils/formatters";

function AddMoneyDialog({ goal, onClose }) {
  const { jars, addMoneyToGoal } = useAppData();
  const [amount, setAmount] = useState("");

  const jar = jars.find((item) => item.id === goal.jarId);
  const available = jar ? jar.balance : 0;
  const stillNeeded = goal.targetAmount - goal.savedAmount;
  const maxAmount = Math.max(Math.min(available, stillNeeded), 0);

  const isValid = Number(amount) > 0 && Number(amount) <= maxAmount;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;
    addMoneyToGoal(goal.id, Number(amount));
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{ "& .MuiDialog-paper": { m: { xs: 2, md: 4 } } }}
    >
      <DialogTitle sx={{ fontSize: { xs: "1.05rem", md: "1.25rem" } }}>
        Add money to {goal.name}
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, md: 3 } }}>
        <Typography
          color="text.secondary"
          sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" }, mb: 2 }}
        >
          {jar ? jar.name : "Jar"} has {formatCurrency(available)}. You can add
          up to {formatCurrency(maxAmount)}.
        </Typography>
        <TextField
          autoFocus
          label="Amount (₹)"
          type="number"
          size="small"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          error={Number(amount) > maxAmount}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, md: 3 } }}>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddMoneyDialog;
