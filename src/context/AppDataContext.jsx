import { createContext } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import defaultJars from "../utils/defaultJars";
import useAuth from "../hooks/useAuth";
import useUserDocument from "../hooks/useUserDocument";
import {
  createNotification,
  getNewlyCompletedGoals,
  getNewlyLowJars,
} from "../utils/notificationHelpers";
import {
  applyTransaction,
  canReverse,
  reverseTransaction,
} from "../utils/transactionHelpers";

export const AppDataContext = createContext(null);

const initialData = {
  jars: defaultJars,
  transactions: [],
  goals: [],
  notifications: [],
  onboarded: false,
};

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [data, setData, { loading, error }] = useUserDocument(
    user.uid,
    initialData,
  );
  const { jars, transactions, goals, notifications, onboarded } = data;

  const updateField = (field) => (updater) =>
    setData((previous) => ({
      ...previous,
      [field]:
        typeof updater === "function" ? updater(previous[field]) : updater,
    }));

  const setJars = updateField("jars");
  const setTransactions = updateField("transactions");
  const setGoals = updateField("goals");
  const setNotifications = updateField("notifications");

  const notifyGoalsReached = (oldGoals, newGoals) => {
    const completed = getNewlyCompletedGoals(oldGoals, newGoals);
    if (completed.length === 0) return;

    const newNotifications = completed.map((goal) =>
      createNotification("goal", `You reached your goal: ${goal.name}!`),
    );

    setNotifications((previous) =>
      [...newNotifications, ...previous].slice(0, 50),
    );
  };

  const notifyLowJars = (
    oldJars,
    oldTransactions,
    newJars,
    newTransactions,
  ) => {
    const lowJars = getNewlyLowJars(
      oldJars,
      oldTransactions,
      newJars,
      newTransactions,
    );
    if (lowJars.length === 0) return;

    const newNotifications = lowJars.map((jar) =>
      createNotification(
        "jar",
        jar.balance <= 0
          ? `${jar.name} is empty.`
          : `${jar.name} is running low.`,
      ),
    );

    setNotifications((previous) =>
      [...newNotifications, ...previous].slice(0, 50),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true })),
    );
  };

  const clearNotifications = () => setNotifications([]);

  const addTransaction = (transaction) => {
    const result = applyTransaction(jars, goals, transaction);

    const newTransaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...transaction,
      allocations: result.allocations,
    };
    const newTransactions = [newTransaction, ...transactions];

    setTransactions(newTransactions);
    setJars(result.jars);
    setGoals(result.goals);
    notifyGoalsReached(goals, result.goals);
    notifyLowJars(jars, transactions, result.jars, newTransactions);
  };

  const updateTransaction = (transactionId, changes) => {
    const target = transactions.find((item) => item.id === transactionId);
    if (!target || !canReverse(target)) return;

    const reversed = reverseTransaction(jars, goals, target);
    const updated = { ...target, ...changes };
    const result = applyTransaction(reversed.jars, reversed.goals, updated);

    const updatedTransaction = { ...updated, allocations: result.allocations };
    const newTransactions = transactions.map((item) =>
      item.id === transactionId ? updatedTransaction : item,
    );

    setTransactions(newTransactions);
    setJars(result.jars);
    setGoals(result.goals);
    notifyGoalsReached(goals, result.goals);
    notifyLowJars(jars, transactions, result.jars, newTransactions);
  };

  const deleteTransaction = (transactionId) => {
    const target = transactions.find((item) => item.id === transactionId);
    if (!target || !canReverse(target)) return;

    const reversed = reverseTransaction(jars, goals, target);
    const newTransactions = transactions.filter(
      (item) => item.id !== transactionId,
    );

    setJars(reversed.jars);
    setGoals(reversed.goals);
    setTransactions(newTransactions);
    notifyLowJars(jars, transactions, reversed.jars, newTransactions);
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

  const resetJarSettings = () => {
    setJars((previousJars) =>
      previousJars.map((jar) => {
        const original = defaultJars.find((item) => item.id === jar.id);
        return original
          ? {
              ...jar,
              percent: original.percent,
              limitPercent: original.limitPercent,
            }
          : jar;
      }),
    );
  };

  const resetAllData = () => {
    setData(initialData);
  };

  const completeSetup = (percents) => {
    setData((previous) => ({
      ...previous,
      onboarded: true,
      jars: previous.jars.map((jar) => ({
        ...jar,
        percent: percents[jar.id] ?? jar.percent,
      })),
    }));
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

    const updatedGoals = goals.map((item) =>
      item.id === goalId
        ? { ...item, savedAmount: item.savedAmount + amount }
        : item,
    );
    const updatedJars = jars.map((jar) =>
      jar.id === goal.jarId ? { ...jar, balance: jar.balance - amount } : jar,
    );

    setGoals(updatedGoals);
    setJars(updatedJars);
    notifyGoalsReached(goals, updatedGoals);
    notifyLowJars(jars, transactions, updatedJars, transactions);
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

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Could not load your data. Check your connection and refresh the page.
        </Alert>
      </Box>
    );
  }

  const value = {
    jars,
    transactions,
    goals,
    notifications,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateJarSettings,
    resetJarSettings,
    resetAllData,
    addGoal,
    addMoneyToGoal,
    updateGoal,
    deleteGoal,
    markAllNotificationsRead,
    clearNotifications,
    onboarded,
    completeSetup,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
