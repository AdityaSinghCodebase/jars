import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Wave from "./Wave";
import { formatCurrency } from "../utils/formatters";

function Jar({ name, balance, fillPercent, color }) {
  const safeFill = Math.min(Math.max(fillPercent, 0), 100);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: { xs: 56, md: 80 },
          height: { xs: 10, md: 14 },
          bgcolor: "grey.400",
          borderRadius: "6px 6px 0 0",
        }}
      />

      <Box
        sx={{
          position: "relative",
          width: { xs: 80, md: 110 },
          height: { xs: 110, md: 150 },
          border: "3px solid",
          borderColor: "grey.400",
          borderRadius: "0 0 24px 24px",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${safeFill}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: color,
          }}
        >
          {safeFill > 0 && (
            <>
              <Wave color={color} duration={4} opacity={0.5} reverse />
              <Wave color={color} duration={3} />
            </>
          )}
        </motion.div>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            px: { xs: 0.75, md: 1.25 },
            py: 0.25,
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.88)",
            boxShadow: 1,
            whiteSpace: "nowrap",
          }}
        >
          <Typography
            fontWeight={700}
            sx={{ fontSize: { xs: "0.75rem", md: "0.95rem" } }}
          >
            {formatCurrency(balance)}
          </Typography>
        </Box>
      </Box>

      <Typography
        fontWeight={600}
        sx={{
          mt: 1,
          textAlign: "center",
          fontSize: { xs: "0.85rem", md: "1rem" },
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}

export default Jar;
