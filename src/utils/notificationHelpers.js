import { getFillPercent, getJarCapacity, getTotalIncome } from "./jarHelpers";

export const LOW_JAR_PERCENT = 20;

export function createNotification(type, message) {
  return {
    id: crypto.randomUUID(),
    type,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

export function getNewlyCompletedGoals(oldGoals, newGoals) {
  return newGoals.filter((goal) => {
    const before = oldGoals.find((item) => item.id === goal.id);
    return (
      before &&
      before.savedAmount < before.targetAmount &&
      goal.savedAmount >= goal.targetAmount
    );
  });
}

export function getNewlyLowJars(
  oldJars,
  oldTransactions,
  newJars,
  newTransactions,
) {
  const oldIncome = getTotalIncome(oldTransactions);
  const newIncome = getTotalIncome(newTransactions);

  return newJars.filter((jar) => {
    const before = oldJars.find((item) => item.id === jar.id);
    if (!before || jar.balance >= before.balance) return false;

    const newCapacity = getJarCapacity(newIncome, jar.limitPercent);
    if (newCapacity <= 0) return false;

    const oldCapacity = getJarCapacity(oldIncome, before.limitPercent);
    const oldFill =
      oldCapacity > 0 ? getFillPercent(before.balance, oldCapacity) : 100;
    const newFill = getFillPercent(jar.balance, newCapacity);

    const crossedLow = oldFill >= LOW_JAR_PERCENT && newFill < LOW_JAR_PERCENT;
    const crossedEmpty = before.balance > 0 && jar.balance <= 0;

    return crossedLow || crossedEmpty;
  });
}
