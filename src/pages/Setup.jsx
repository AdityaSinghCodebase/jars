import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Slider,
  Typography,
} from "@mui/material";
import Logo from "../components/Logo";
import useAppData from "../hooks/useAppData";
import defaultJars from "../utils/defaultJars";

function resolveSplit(values) {
  let remaining = 100;

  return values.map((value, index) => {
    const isLast = index === values.length - 1;
    const resolved = isLast ? remaining : Math.min(value, remaining);
    remaining -= resolved;
    return resolved;
  });
}

function Setup() {
  const { jars, onboarded, completeSetup } = useAppData();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(() => jars.map((jar) => jar.percent));

  if (onboarded) return <Navigate to="/" replace />;

  const split = resolveSplit(values);
  const usedBefore = split
    .slice(0, step)
    .reduce((sum, value) => sum + value, 0);
  const maxForStep = 100 - usedBefore;
  const jar = jars[step];
  const isLast = step === jars.length - 1;

  const buildPercents = (percentList) =>
    Object.fromEntries(
      jars.map((item, index) => [item.id, percentList[index]]),
    );

  const handleSliderChange = (event, value) => {
    setValues((previous) =>
      previous.map((item, index) => (index === step ? value : item)),
    );
  };

  const handleNext = () => {
    if (isLast) {
      completeSetup(buildPercents(split));
    } else {
      setStep((previous) => previous + 1);
    }
  };

  const handleUseDefaults = () => {
    completeSetup(
      buildPercents(
        jars.map(
          (item) => defaultJars.find((d) => d.id === item.id)?.percent ?? 0,
        ),
      ),
    );
  };

  return (
    <Box
      sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}
    >
      <Paper
        variant="outlined"
        sx={{ width: "100%", maxWidth: 440, p: { xs: 2.5, md: 4 } }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Logo size={44} />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Step {step + 1} of {jars.length}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={((step + 1) / jars.length) * 100}
          sx={{ height: 6, borderRadius: 3, mt: 1, mb: 3 }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: jar.color,
            }}
          />
          <Typography variant="h5" fontWeight={700}>
            {jar.name}
          </Typography>
        </Box>
        <Typography color="text.secondary" sx={{ mb: 3, fontSize: "0.9rem" }}>
          What percent of every income should go into this jar?
        </Typography>

        <Typography
          variant="h3"
          fontWeight={700}
          color="primary"
          sx={{ mb: 1 }}
        >
          {split[step]}%
        </Typography>

        {isLast ? (
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            This is the last jar, so it gets everything that is left.
          </Typography>
        ) : (
          <>
            <Slider
              value={split[step]}
              onChange={handleSliderChange}
              min={0}
              max={maxForStep}
              aria-label={`${jar.name} percent`}
            />
            <Typography
              color="text.secondary"
              sx={{ mb: 3, fontSize: "0.9rem" }}
            >
              Left for the other jars: {maxForStep - split[step]}%
            </Typography>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Button
            disabled={step === 0}
            onClick={() => setStep((previous) => previous - 1)}
          >
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {isLast ? "Finish" : "Next"}
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button size="small" color="inherit" onClick={handleUseDefaults}>
            Use default split
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Setup;
