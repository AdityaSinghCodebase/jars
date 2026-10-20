import { Box } from "@mui/material";
import { motion } from "framer-motion";

const WAVE_HEIGHT = 12;

function Wave({ color, duration = 3, opacity = 1, reverse = false }) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        top: -WAVE_HEIGHT,
        height: WAVE_HEIGHT,
        pointerEvents: "none",
      }}
    >
      <motion.svg
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        style={{ display: "block", width: "200%", height: "100%", opacity }}
        initial={{ x: reverse ? "-50%" : "0%" }}
        animate={{ x: reverse ? "0%" : "-50%" }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <path
          d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 V20 H0 Z"
          fill={color}
        />
      </motion.svg>
    </Box>
  );
}

export default Wave;
