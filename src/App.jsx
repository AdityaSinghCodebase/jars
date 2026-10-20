import { Button, Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Jars from "./pages/Jars";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/jars" element={<Jars />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/goals" element={<Goals />} />
    </Routes>
  );
}

export default App;
