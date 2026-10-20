import { createContext, useState } from "react";
import defaultJars from "../utils/defaultJars";

export const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [jars, setJars] = useState(defaultJars);
  const [transactions, setTransactions] = useState([]);

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

  const value = { jars, transactions, addTransaction };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
