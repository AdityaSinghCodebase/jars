import { Box } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatCurrency } from "../utils/formatters";

function MonthlyBarChart({ data, isMobile }) {
  return (
    <Box sx={{ width: "100%", height: { xs: 280, md: 320 } }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 0, left: isMobile ? -10 : 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: isMobile ? 11 : 13 }} />
          <YAxis
            tickFormatter={formatCompact}
            tick={{ fontSize: isMobile ? 11 : 13 }}
            width={isMobile ? 40 : 55}
          />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
          <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default MonthlyBarChart;
