import { useMemo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

const COLORS = ["#4F46E5", "#F59E0B", "#10B981", "#EC4899", "#EF4444"];

function Confetti({ count = 28 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 120,
        spin: Math.random() * 720 - 360,
        delay: Math.random() * 0.3,
        duration: 1.4 + Math.random(),
        size: 6 + Math.random() * 6,
        color: COLORS[index % COLORS.length],
      })),
    [count],
  );

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: 240, x: piece.drift, rotate: piece.spin, opacity: 0 }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            borderRadius: 1,
          }}
        />
      ))}
    </Box>
  );
}

export default Confetti;
