import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SavingsIcon from "@mui/icons-material/Savings";
import BarChartIcon from "@mui/icons-material/BarChart";
import FlagIcon from "@mui/icons-material/Flag";

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { label: "Transactions", path: "/transactions", icon: <ReceiptLongIcon /> },
  { label: "Jars", path: "/jars", icon: <SavingsIcon /> },
  { label: "Reports", path: "/reports", icon: <BarChartIcon /> },
  { label: "Goals", path: "/goals", icon: <FlagIcon /> },
];

export default navItems;
