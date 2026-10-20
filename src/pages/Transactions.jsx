import { Box, Paper, Stack, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import useAppData from "../hooks/useAppData";
import { formatCurrency, formatDate } from "../utils/formatters";

function Transactions() {
  const { jars, transactions } = useAppData();

  const getJarName = (jarId) => jars.find((jar) => jar.id === jarId)?.name;

  return (
    <>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Transactions
      </Typography>

      {transactions.length === 0 ? (
        <Typography color="text.secondary">
          No transactions yet. Tap the + button to add your first one.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";

            return (
              <Paper
                key={transaction.id}
                variant="outlined"
                sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isIncome ? "success.main" : "error.main",
                    bgcolor: isIncome ? "success.light" : "error.light",
                  }}
                >
                  {isIncome ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography fontWeight={600} noWrap>
                    {transaction.note || (isIncome ? "Income" : "Expense")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isIncome
                      ? "Split across all jars"
                      : getJarName(transaction.jarId)}
                    •{formatDate(transaction.date)}
                  </Typography>
                </Box>

                <Typography
                  fontWeight={700}
                  color={isIncome ? "success.main" : "error.main"}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </Typography>
              </Paper>
            );
          })}
        </Stack>
      )}
    </>
  );
}

export default Transactions;
