import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import Jar from "../components/Jar";
import ManageJarsDialog from "../components/ManageJarDialog";
import useAppData from "../hooks/useAppData";
import {
  getFillPercent,
  getJarCapacity,
  getTotalIncome,
} from "../utils/jarHelpers";

import JarGrid from "../components/JarGrid";

function Jars() {
  const { jars, transactions } = useAppData();
  const totalIncome = getTotalIncome(transactions);
  const [manageOpen, setManageOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Jars
        </Typography>
        <Button
          variant="outlined"
          startIcon={<TuneIcon />}
          onClick={(event) => {
            event.currentTarget.blur();
            setManageOpen(true);
          }}
        >
          Manage jars
        </Button>
      </Box>

      <JarGrid>
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
      </JarGrid>

      {manageOpen && <ManageJarsDialog onClose={() => setManageOpen(false)} />}
    </>
  );
}

export default Jars;
