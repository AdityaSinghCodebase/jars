import { createContext, useState } from "react";
import defaultJars from "../utils/defaultJars";
import useLocalStorage from "../hooks/useLocalStorage";
import { applyIncomeToGoals } from "../utils/goalHelpers";

export const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [jars, setJars] = useLocalStorage("spendwise-jars", defaultJars);
  const [transactions, setTransactions] = useLocalStorage(
    "spendwise-transactions",
    [],
  );
  const [goals, setGoals] = useLocalStorage("spendwise-goals", []);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...transaction,
    };

    setTransactions((previous) => [newTransaction, ...previous]);

    if (transaction.type === "expense") {
      setJars((previousJars) =>
        previousJars.map((jar) =>
          jar.id === transaction.jarId
            ? { ...jar, balance: jar.balance - transaction.amount }
            : jar,
        ),
      );
      return;
    }

    const { updatedGoals, remainingIncome } = applyIncomeToGoals(
      goals,
      transaction.amount,
    );

    setGoals(updatedGoals);

    setJars((previousJars) =>
      previousJars.map((jar) => ({
        ...jar,
        balance: jar.balance + (remainingIncome * jar.percent) / 100,
      })),
    );
  };

  const updateJarSettings = (updatedJars) => {
    setJars((previousJars) =>
      previousJars.map((jar) => {
        const updated = updatedJars.find((item) => item.id === jar.id);
        return updated
          ? {
              ...jar,
              percent: updated.percent,
              limitPercent: updated.limitPercent,
            }
          : jar;
      }),
    );
  };
  const addGoal = (goal) => {
    const newGoal = {
      id: crypto.randomUUID(),
      savedAmount: 0,
      createdAt: new Date().toISOString(),
      ...goal,
    };

    setGoals((previous) => [newGoal, ...previous]);
  };

  const addMoneyToGoal = (goalId, amount) => {
    const goal = goals.find((item) => item.id === goalId);
    if (!goal || goal.fundingType !== "jar") return;

    setGoals((previous) =>
      previous.map((item) =>
        item.id === goalId
          ? { ...item, savedAmount: item.savedAmount + amount }
          : item,
      ),
    );

    setJars((previous) =>
      previous.map((jar) =>
        jar.id === goal.jarId ? { ...jar, balance: jar.balance - amount } : jar,
      ),
    );
  };

  const updateGoal = (goalId, changes) => {
    setGoals((previous) =>
      previous.map((goal) =>
        goal.id === goalId ? { ...goal, ...changes } : goal,
      ),
    );
  };

  const deleteGoal = (goalId) => {
    const goal = goals.find((item) => item.id === goalId);
    if (!goal) return;

    if (goal.savedAmount > 0 && goal.fundingType === "jar") {
      setJars((previous) =>
        previous.map((jar) =>
          jar.id === goal.jarId
            ? { ...jar, balance: jar.balance + goal.savedAmount }
            : jar,
        ),
      );
    }

    if (goal.savedAmount > 0 && goal.fundingType === "percent") {
      setJars((previous) =>
        previous.map((jar) => ({
          ...jar,
          balance: jar.balance + (goal.savedAmount * jar.percent) / 100,
        })),
      );
    }

    setGoals((previous) => previous.filter((item) => item.id !== goalId));
  };

  const value = {
    jars,
    transactions,
    goals,
    addTransaction,
    updateJarSettings,
    addGoal,
    addMoneyToGoal,
    updateGoal,
    deleteGoal,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
