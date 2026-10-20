import { Box, Typography } from "@mui/material";
import GoalCard from "../components/GoalCard";
import useAppData from "../hooks/useAppData";

function Goals() {
  const { goals } = useAppData();

  return (
    <>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Goals
      </Typography>

      {goals.length === 0 ? (
        <Typography color="text.secondary">
          No goals yet. Tap the + button to create your first one.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </Box>
      )}
    </>
  );
}

export default Goals;
