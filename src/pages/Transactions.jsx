import { Stack, Typography } from "@mui/material";
import TransactionItem from "../components/TransactionItem";
import useAppData from "../hooks/useAppData";
import { getJarName } from "../utils/jarHelpers";

function Transactions() {
  const { jars, transactions } = useAppData();

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
          {transactions.map((transaction) => (
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

export default Transactions;
