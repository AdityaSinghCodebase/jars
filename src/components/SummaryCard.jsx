import { Paper, Typography } from "@mui/material";
import { formatCurrency } from "../utils/formatters";

function SummaryCard({ title, amount, color, sx }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 3 }, ...sx }}>
      <Typography
        color="text.secondary"
        sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
      >
        {title}
      </Typography>
      <Typography
        fontWeight={700}
        color={color}
        sx={{ mt: 0.5, fontSize: { xs: "1.15rem", md: "1.5rem" } }}
      >
        {formatCurrency(amount)}
      </Typography>
    </Paper>
  );
}

export default SummaryCard;
