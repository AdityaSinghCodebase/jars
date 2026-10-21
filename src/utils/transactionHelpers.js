import { applyIncomeToGoals } from "./goalHelpers";

export function canReverse(transaction) {
  return transaction.type === "expense" || Boolean(transaction.allocations);
}

export function applyTransaction(jars, goals, transaction) {
  if (transaction.type === "expense") {
    return {
      jars: jars.map((jar) =>
        jar.id === transaction.jarId
          ? { ...jar, balance: jar.balance - transaction.amount }
          : jar,
      ),
      goals,
      allocations: null,
    };
  }

  const { updatedGoals, remainingIncome } = applyIncomeToGoals(
    goals,
    transaction.amount,
  );

  const goalAllocations = updatedGoals
    .map((goal, index) => ({
      goalId: goal.id,
      amount: goal.savedAmount - goals[index].savedAmount,
    }))
    .filter((item) => item.amount > 0);

  const jarAllocations = jars.map((jar) => ({
    jarId: jar.id,
    amount: (remainingIncome * jar.percent) / 100,
  }));

  return {
    jars: jars.map((jar, index) => ({
      ...jar,
      balance: jar.balance + jarAllocations[index].amount,
    })),
    goals: updatedGoals,
    allocations: { goals: goalAllocations, jars: jarAllocations },
  };
}

export function reverseTransaction(jars, goals, transaction) {
  if (transaction.type === "expense") {
    return {
      jars: jars.map((jar) =>
        jar.id === transaction.jarId
          ? { ...jar, balance: jar.balance + transaction.amount }
          : jar,
      ),
      goals,
    };
  }

  const { allocations } = transaction;

  return {
    jars: jars.map((jar) => {
      const share = allocations.jars.find((item) => item.jarId === jar.id);
      return share ? { ...jar, balance: jar.balance - share.amount } : jar;
    }),
    goals: goals.map((goal) => {
      const share = allocations.goals.find((item) => item.goalId === goal.id);
      return share
        ? { ...goal, savedAmount: Math.max(goal.savedAmount - share.amount, 0) }
        : goal;
    }),
  };
}
