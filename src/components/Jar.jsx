import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

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
        />
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
      <Typography
        color="text.secondary"
        sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
      >
        ₹{balance}
      </Typography>
    </Box>
  );
}

export default Jar;
