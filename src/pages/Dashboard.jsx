import { Typography, Button } from "@mui/material";

import useAppData from "../hooks/useAppData";

function Dashboard() {
  const { jars, addTransaction } = useAppData();

  return (
    <>
      <Typography variant="h4">Dashboard</Typography>

      {jars.map((jar) => (
        <Typography key={jar.id}>
          {jar.name}: ₹{jar.balance}
        </Typography>
      ))}

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() =>
          addTransaction({ type: "income", amount: 10000, note: "Test salary" })
        }
      >
        Add ₹10,000 income (test)
      </Button>
    </>
  );
}

export default Dashboard;
