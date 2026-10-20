import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Wave from "./Wave";

function Logo({ size = 40 }) {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          sx={{
            width: size * 0.5,
            height: size * 0.1,
            bgcolor: "grey.400",
            borderRadius: "3px 3px 0 0",
          }}
        />
        <Box
          sx={{
            position: "relative",
            width: size * 0.72,
            height: size * 0.9,
            border: "2px solid",
            borderColor: "grey.400",
            borderRadius: `0 0 ${size * 0.25}px ${size * 0.25}px`,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "65%" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: color,
            }}
          >
            <Wave
              color={color}
              duration={4}
              opacity={0.5}
              reverse
              height={size * 0.2}
            />
            <Wave color={color} duration={3} height={size * 0.2} />
          </motion.div>
        </Box>
      </Box>

      <Typography
        component="span"
        fontWeight={800}
        sx={{ fontSize: size * 0.6, lineHeight: 1, letterSpacing: "-0.5px" }}
      >
        Jars
        <Box component="span" sx={{ color: "secondary.main" }}>
          !
        </Box>
      </Typography>
    </Box>
  );
}

export default Logo;
