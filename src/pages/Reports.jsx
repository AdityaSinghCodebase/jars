import { useState } from "react";
import {
  Box,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import MonthlyBarChart from "../components/MonthlyBarChart";
import SpendingPieChart from "../components/SpendingPieChart";
import SummaryCard from "../components/SummaryCard";
import useAppData from "../hooks/useAppData";
import { getJarExpense } from "../utils/jarHelpers";
import {
  filterByMonth,
  getAvailableMonths,
  getMonthKey,
  getMonthLabel,
  getMonthlyTotals,
  getTotals,
} from "../utils/reportHelpers";
import { formatCurrency } from "../utils/formatters";

function Reports() {
  const { jars, transactions } = useAppData();
  const [selectedMonth, setSelectedMonth] = useState(
    getMonthKey(new Date().toISOString()),
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const months = getAvailableMonths(transactions);
  const monthTransactions = filterByMonth(transactions, selectedMonth);
  const { income, expense } = getTotals(monthTransactions);
  const net = income - expense;

  const chartData = jars.map((jar) => ({
    jar: jar.name,
    "Spent this month": getJarExpense(monthTransactions, jar.id),
    "Balance now": jar.balance,
  }));

  const pieData = jars.map((jar) => ({
    name: jar.name,
    value: getJarExpense(monthTransactions, jar.id),
    color: jar.color,
  }));

  const monthlyData = getMonthlyTotals(transactions);
  const hasData = monthTransactions.length > 0;
  const monthLabel = getMonthLabel(selectedMonth);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Reports
        </Typography>
        <TextField
          select
          size="small"
          label="Month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          {months.map((month) => (
            <MenuItem key={month} value={month}>
              {getMonthLabel(month)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
          gap: { xs: 1.5, md: 2 },
          mb: { xs: 3, md: 4 },
        }}
      >
        <SummaryCard
          title="Net saved"
          amount={net}
          color={net >= 0 ? "success.main" : "error.main"}
          sx={{ gridColumn: { xs: "span 2", sm: "auto" } }}
        />
        <SummaryCard title="Income" amount={income} color="success.main" />
        <SummaryCard title="Expenses" amount={expense} color="error.main" />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Where your money went
          </Typography>
          <SpendingPieChart data={pieData} monthLabel={monthLabel} />
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Last 6 months
          </Typography>
          <MonthlyBarChart data={monthlyData} isMobile={isMobile} />
        </Paper>

        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, md: 3 }, gridColumn: { md: "span 2" } }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Spending by jar
          </Typography>

          {hasData ? (
            <Box sx={{ width: "100%", height: { xs: 330, md: 400 } }}>
              <ResponsiveContainer>
                <RadarChart
                  data={chartData}
                  outerRadius={isMobile ? "58%" : "70%"}
                  margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
                >
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="jar"
                    tick={{ fontSize: isMobile ? 11 : 13 }}
                  />
                  {!isMobile && (
                    <PolarRadiusAxis tickFormatter={formatCurrency} />
                  )}
                  <Radar
                    name="Spent this month"
                    dataKey="Spent this month"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Balance now"
                    dataKey="Balance now"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Typography color="text.secondary">
              No transactions in {monthLabel}.
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
}

export default Reports;
