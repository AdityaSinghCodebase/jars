export function getFillPercent(balance, limit) {
  if (limit <= 0) return 0;
  return (balance / limit) * 100;
}

export function getJarName(jars, jarId) {
  return jars.find((jar) => jar.id === jarId)?.name;
}

export function getTotalIncome(transactions) {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function getJarCapacity(totalIncome, limitPercent) {
  return (totalIncome * limitPercent) / 100;
}
