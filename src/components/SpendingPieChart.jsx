import { Box, Typography } from "@mui/material";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "../utils/formatters";

function SpendingPieChart({ data, monthLabel }) {
  const slices = data.filter((item) => item.value > 0);

  if (slices.length === 0) {
    return (
      <Typography color="text.secondary">
        No expenses in {monthLabel}.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", height: { xs: 280, md: 320 } }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
          >
            {slices.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default SpendingPieChart;
