import { Box, Typography } from "@mui/material";
import Jar from "../components/Jar";
import useAppData from "../hooks/useAppData";
import { getFillPercent } from "../utils/jarHelpers";

function Jars() {
  const { jars } = useAppData();

  return (
    <>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Jars
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {jars.map((jar) => (
          <Jar
            key={jar.id}
            name={jar.name}
            balance={jar.balance}
            fillPercent={getFillPercent(jar.balance, jar.limit)}
            color={jar.color}
          />
        ))}
      </Box>
    </>
  );
}

export default Jars;
