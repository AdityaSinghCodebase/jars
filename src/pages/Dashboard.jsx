import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import SummaryCard from "../components/SummaryCard";
import TransactionItem from "../components/TransactionItem";
import useAppData from "../hooks/useAppData";
import {
  getFillPercent,
  getJarName,
  getJarCapacity,
  getTotalIncome,
} from "../utils/jarHelpers";
import JarGrid from "../components/JarGrid";

function Dashboard() {
  const { jars, transactions } = useAppData();

  const totalBalance = jars.reduce((sum, jar) => sum + jar.balance, 0);

  const totalIncome = getTotalIncome(transactions);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const recentTransactions = transactions.slice(0, 5);
  const capacity = getJarCapacity(totalIncome, jars[0].limitPercent);

  return (
    <>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
          gap: { xs: 1.5, md: 2 },
          mb: { xs: 3, md: 5 },
        }}
      >
        <SummaryCard
          title="Total balance"
          amount={totalBalance}
          color="primary.main"
          sx={{ gridColumn: { xs: "span 2", sm: "auto" } }}
        />
        <SummaryCard
          title="Total income"
          amount={totalIncome}
          color="success.main"
        />
        <SummaryCard
          title="Total expenses"
          amount={totalExpense}
          color="error.main"
        />
      </Box>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Your jars
      </Typography>

      <Box sx={{ mb: 5 }}>
        <JarGrid />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Recent transactions
        </Typography>
        <Button component={RouterLink} to="/transactions">
          View all
        </Button>
      </Box>

      {recentTransactions.length === 0 ? (
        <Typography color="text.secondary">
          No transactions yet. Tap the + button to add one.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {recentTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              jarName={getJarName(jars, transaction.jarId)}
            />
          ))}
        </Stack>
      )}
    </>
  );
}

export default Dashboard;
