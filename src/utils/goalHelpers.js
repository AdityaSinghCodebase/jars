export function getGoalProgress(savedAmount, targetAmount) {
  if (targetAmount <= 0) return 0;
  return Math.min((savedAmount / targetAmount) * 100, 100);
}

export function applyIncomeToGoals(goals, incomeAmount) {
  let remainingIncome = incomeAmount;

  const updatedGoals = goals.map((goal) => {
    if (goal.fundingType !== "percent") return goal;

    const share = (incomeAmount * goal.percent) / 100;
    const stillNeeded = goal.targetAmount - goal.savedAmount;
    const contribution = Math.max(
      Math.min(share, stillNeeded, remainingIncome),
      0,
    );

    remainingIncome -= contribution;
    return { ...goal, savedAmount: goal.savedAmount + contribution };
  });

  return { updatedGoals, remainingIncome };
}
