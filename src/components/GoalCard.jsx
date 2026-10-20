import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddMoneyDialog from "./AddMoneyDialog";
import Confetti from "./Confetti";
import useAppData from "../hooks/useAppData";
import { getGoalIcon } from "../utils/goalIcons";
import { getGoalProgress } from "../utils/goalHelpers";
import { getJarName } from "../utils/jarHelpers";
import { formatCurrency } from "../utils/formatters";

function GoalCard({ goal }) {
  const { jars } = useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const Icon = getGoalIcon(goal.iconKey);
  const progress = getGoalProgress(goal.savedAmount, goal.targetAmount);
  const isJarGoal = goal.fundingType === "jar";
  const isComplete = progress >= 100;

  const previousProgress = useRef(progress);

  useEffect(() => {
    let timer;

    if (previousProgress.current < 100 && progress >= 100) {
      setCelebrating(true);
      timer = setTimeout(() => setCelebrating(false), 3000);
    }

    previousProgress.current = progress;
    return () => clearTimeout(timer);
  }, [progress]);

  const fundingLabel =
    goal.fundingType === "percent"
      ? `${goal.percent}% of every income`
      : isJarGoal
        ? `From ${getJarName(jars, goal.jarId)}`
        : "";

  const handleOpenDialog = (event) => {
    event.currentTarget.blur();
    setDialogOpen(true);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {celebrating && <Confetti />}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isComplete ? "success.main" : "primary.main",
            bgcolor: "action.hover",
            flexShrink: 0,
          }}
        >
          <Icon />
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography fontWeight={600} noWrap>
            {goal.name}
          </Typography>
          {fundingLabel && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {fundingLabel}
            </Typography>
          )}
        </Box>
        {isComplete && (
          <Chip
            icon={<CheckCircleIcon />}
            label="Goal reached"
            color="success"
            size="small"
          />
        )}
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        color={isComplete ? "success" : "primary"}
        sx={{ height: 10, borderRadius: 5 }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {formatCurrency(goal.savedAmount)} of{" "}
          {formatCurrency(goal.targetAmount)}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {Math.round(progress)}%
        </Typography>
      </Box>

      {isJarGoal && !isComplete && (
        <Button
          size="small"
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={handleOpenDialog}
        >
          Add money
        </Button>
      )}

      {dialogOpen && (
        <AddMoneyDialog goal={goal} onClose={() => setDialogOpen(false)} />
      )}
    </Paper>
  );
}

export default GoalCard;
