import { Box, IconButton, Paper, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatCurrency, formatDate } from "../utils/formatters";

function TransactionItem({ transaction, jarName, onEdit, onDelete }) {
  const isIncome = transaction.type === "income";

  return (
    <Paper
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
          flexShrink: 0,
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
          {isIncome ? "Split across all jars" : jarName} •{" "}
          {formatDate(transaction.date)}
        </Typography>
      </Box>

      <Typography
        fontWeight={700}
        color={isIncome ? "success.main" : "error.main"}
        sx={{ whiteSpace: "nowrap" }}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </Typography>

      {(onEdit || onDelete) && (
        <Box sx={{ display: "flex", flexShrink: 0 }}>
          {onEdit && (
            <IconButton
              size="small"
              aria-label="Edit transaction"
              onClick={onEdit}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              aria-label="Delete transaction"
              onClick={onDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default TransactionItem;
