import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import useAppData from "../hooks/useAppData";
import { formatCurrency } from "../utils/formatters";
import { getJarCapacity, getTotalIncome } from "../utils/jarHelpers";

function ManageJarsDialog({ onClose }) {
  const { jars, transactions, updateJarSettings } = useAppData();
  const totalIncome = getTotalIncome(transactions);

  const [draft, setDraft] = useState(
    jars.map(({ id, name, percent, limitPercent }) => ({
      id,
      name,
      percent,
      limitPercent,
    })),
  );

  const handlePercentChange = (id) => (event, value) => {
    setDraft((previous) => {
      const used = previous.reduce((sum, jar) => sum + jar.percent, 0);

      return previous.map((jar) => {
        if (jar.id !== id) return jar;
        const maxAllowed = 100 - used + jar.percent;
        return { ...jar, percent: Math.min(value, maxAllowed) };
      });
    });
  };

  const handleLimitChange = (id) => (event) => {
    setDraft((previous) =>
      previous.map((jar) =>
        jar.id === id
          ? { ...jar, limitPercent: Number(event.target.value) }
          : jar,
      ),
    );
  };

  const usedPercent = draft.reduce((sum, jar) => sum + jar.percent, 0);
  const leftPercent = 100 - usedPercent;
  const isValid =
    leftPercent === 0 &&
    draft.every((jar) => jar.limitPercent > 0 && jar.limitPercent <= 100);

  const handleSave = () => {
    updateJarSettings(draft);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage jars</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px dashed",
              borderColor: leftPercent === 0 ? "success.main" : "warning.main",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight={600}>Left to assign</Typography>
              <Typography
                fontWeight={700}
                color={leftPercent === 0 ? "success.main" : "warning.main"}
              >
                {leftPercent}%
              </Typography>
            </Box>
            <Slider
              value={leftPercent}
              min={0}
              max={100}
              disabled
              aria-label="Percentage left to assign"
            />
            <Typography variant="body2" color="text.secondary">
              {leftPercent === 0
                ? "All percent is assigned. Lower a jar to free some up."
                : "Raise a jar below to use this percent."}
            </Typography>
          </Box>

          {draft.map((jar) => (
            <Box key={jar.id}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={600}>{jar.name}</Typography>
                <Typography color="text.secondary">{jar.percent}%</Typography>
              </Box>
              <Slider
                value={jar.percent}
                onChange={handlePercentChange(jar.id)}
                min={0}
                max={100}
                aria-label={`${jar.name} percentage`}
              />
              <TextField
                label="Jar limit (% of total income)"
                type="number"
                size="small"
                value={jar.limitPercent}
                onChange={handleLimitChange(jar.id)}
                helperText={`Capacity now: ${formatCurrency(
                  getJarCapacity(totalIncome, jar.limitPercent),
                )}`}
                fullWidth
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManageJarsDialog;
