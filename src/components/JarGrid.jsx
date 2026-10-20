import { Box } from "@mui/material";
import Jar from "./Jar";
import useAppData from "../hooks/useAppData";
import {
  getFillPercent,
  getJarCapacity,
  getTotalIncome,
} from "../utils/jarHelpers";

function JarGrid() {
  const { jars, transactions } = useAppData();
  const totalIncome = getTotalIncome(transactions);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        rowGap: { xs: 3, md: 4 },
        columnGap: 2,
      }}
    >
      {jars.map((jar) => (
        <Jar
          key={jar.id}
          name={jar.name}
          balance={jar.balance}
          fillPercent={getFillPercent(
            jar.balance,
            getJarCapacity(totalIncome, jar.limitPercent),
          )}
          color={jar.color}
        />
      ))}
    </Box>
  );
}

export default JarGrid;
