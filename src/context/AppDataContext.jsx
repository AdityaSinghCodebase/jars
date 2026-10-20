import { createContext, useState } from "react";
import defaultJars from "../utils/defaultJars";
import useLocalStorage from "../hooks/useLocalStorage";

export const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [jars, setJars] = useLocalStorage("spendwise-jars", defaultJars);
  const [transactions, setTransactions] = useLocalStorage(
    "spendwise-transactions",
    [],
  );

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...transaction,
    };

    setTransactions((previous) => [newTransaction, ...previous]);

    setJars((previousJars) =>
      previousJars.map((jar) => {
        if (transaction.type === "income") {
          return {
            ...jar,
            balance: jar.balance + (transaction.amount * jar.percent) / 100,
          };
        }
        if (jar.id === transaction.jarId) {
          return { ...jar, balance: jar.balance - transaction.amount };
        }
        return jar;
      }),
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
  const value = { jars, transactions, addTransaction, updateJarSettings };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
