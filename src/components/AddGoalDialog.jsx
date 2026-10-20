import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import goalIcons from "../utils/goalIcons";
import useAppData from "../hooks/useAppData";
import { formatCurrency } from "../utils/formatters";

const initialForm = {
  name: "",
  iconKey: "bike",
  targetAmount: "",
  fundingType: "percent",
  percent: 10,
  jarId: "financial-freedom",
};

function getInitialForm(goal) {
  if (!goal) return initialForm;

  return {
    name: goal.name,
    iconKey: goal.iconKey,
    targetAmount: String(goal.targetAmount),
    fundingType: goal.fundingType ?? "percent",
    percent: goal.percent ?? 10,
    jarId: goal.jarId ?? "financial-freedom",
  };
}

const labelSx = { fontSize: { xs: "0.75rem", md: "0.875rem" }, mb: 0.75 };

const toggleGroupSx = {
  "& .MuiToggleButton-root": {
    py: { xs: 0.5, md: 1 },
    fontSize: { xs: "0.75rem", md: "0.875rem" },
  },
  "& .MuiSvgIcon-root": { fontSize: { xs: 20, md: 24 } },
};

function AddGoalDialog({ goal, onClose }) {
  const { jars, addGoal, updateGoal } = useAppData();
  const [form, setForm] = useState(() => getInitialForm(goal));

  const isEditing = Boolean(goal);
  const savedAmount = goal ? goal.savedAmount : 0;
  const targetBelowSaved =
    form.targetAmount !== "" && Number(form.targetAmount) < savedAmount;

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleToggle = (field) => (event, newValue) => {
    if (newValue !== null) {
      setForm((previous) => ({ ...previous, [field]: newValue }));
    }
  };

  const handlePercentChange = (event, value) => {
    setForm((previous) => ({ ...previous, percent: value }));
  };

  const isValid =
    form.name.trim() !== "" &&
    Number(form.targetAmount) > 0 &&
    !targetBelowSaved &&
    (form.fundingType === "percent" || form.jarId !== "");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    const details = {
      name: form.name.trim(),
      iconKey: form.iconKey,
      targetAmount: Number(form.targetAmount),
      fundingType: form.fundingType,
      percent: form.fundingType === "percent" ? form.percent : null,
      jarId: form.fundingType === "jar" ? form.jarId : null,
    };

    if (isEditing) {
      updateGoal(goal.id, details);
    } else {
      addGoal(details);
    }
    onClose();
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
      <DialogTitle
        sx={{
          fontSize: { xs: "1.05rem", md: "1.25rem" },
          pb: { xs: 0.5, md: 1 },
        }}
      >
        {isEditing ? "Edit goal" : "New goal"}
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, md: 3 } }}>
        <Stack spacing={{ xs: 1.75, md: 2.5 }} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Goal name"
            size="small"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="e.g. Buy a bike"
            fullWidth
          />

          <div>
            <Typography color="text.secondary" sx={labelSx}>
              Choose an icon
            </Typography>
            <ToggleButtonGroup
              value={form.iconKey}
              exclusive
              fullWidth
              size="small"
              color="primary"
              onChange={handleToggle("iconKey")}
              sx={toggleGroupSx}
            >
              {Object.entries(goalIcons).map(([key, Icon]) => (
                <ToggleButton key={key} value={key} aria-label={key}>
                  <Icon />
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          <TextField
            label="Target amount (₹)"
            type="number"
            size="small"
            value={form.targetAmount}
            onChange={handleChange("targetAmount")}
            error={targetBelowSaved}
            helperText={
              targetBelowSaved
                ? `Already saved ${formatCurrency(savedAmount)}. Target can't be lower.`
                : ""
            }
            fullWidth
          />

          {!isEditing && (
            <div>
              <Typography color="text.secondary" sx={labelSx}>
                How will you fund it?
              </Typography>
              <ToggleButtonGroup
                value={form.fundingType}
                exclusive
                fullWidth
                size="small"
                color="primary"
                onChange={handleToggle("fundingType")}
                sx={toggleGroupSx}
              >
                <ToggleButton value="percent">% of income</ToggleButton>
                <ToggleButton value="jar">From a jar</ToggleButton>
              </ToggleButtonGroup>
            </div>
          )}

          {form.fundingType === "percent" ? (
            <div>
              <Typography sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}>
                Save {form.percent}% of every income for this goal
              </Typography>
              <Slider
                size="small"
                value={form.percent}
                onChange={handlePercentChange}
                min={1}
                max={100}
                aria-label="Percent of income to save"
              />
            </div>
          ) : (
            <TextField
              select
              size="small"
              label="Withdraw from jar"
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
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, md: 3 }, pb: { xs: 1.5, md: 2 } }}>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="small"
          type="submit"
          variant="contained"
          disabled={!isValid}
        >
          {isEditing ? "Save changes" : "Create goal"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddGoalDialog;
