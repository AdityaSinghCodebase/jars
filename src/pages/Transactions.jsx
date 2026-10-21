import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import AddTransactionDialog from "../components/AddTransactionDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import TransactionItem from "../components/TransactionItem";
import useAppData from "../hooks/useAppData";
import { getJarName } from "../utils/jarHelpers";
import { canReverse } from "../utils/transactionHelpers";
import { formatCurrency } from "../utils/formatters";

function getDeleteMessage(transaction, jars) {
  if (transaction.type === "expense") {
    return `${formatCurrency(transaction.amount)} will go back to ${getJarName(jars, transaction.jarId)}.`;
  }
  return `${formatCurrency(transaction.amount)} will be taken back out of your jars and goals.`;
}

function Transactions() {
  const { jars, transactions, deleteTransaction } = useAppData();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const openFor = (setter, transaction) => (event) => {
    event.currentTarget.blur();
    setter(transaction);
  };

  const handleConfirmDelete = () => {
    deleteTransaction(deleting.id);
    setDeleting(null);
  };

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
              onEdit={
                canReverse(transaction)
                  ? openFor(setEditing, transaction)
                  : undefined
              }
              onDelete={
                canReverse(transaction)
                  ? openFor(setDeleting, transaction)
                  : undefined
              }
            />
          ))}
        </Stack>
      )}

      {editing && (
        <AddTransactionDialog
          open
          transaction={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this transaction?"
          message={getDeleteMessage(deleting, jars)}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}

export default Transactions;
