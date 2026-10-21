export function getMonthKey(isoString) {
  const date = new Date(isoString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
}

export function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" },
  );
}

export function getAvailableMonths(transactions) {
  const keys = new Set(transactions.map((item) => getMonthKey(item.date)));
  keys.add(getMonthKey(new Date().toISOString()));
  return [...keys].sort().reverse();
}

export function filterByMonth(transactions, monthKey) {
  return transactions.filter((item) => getMonthKey(item.date) === monthKey);
}

export function getTotals(transactions) {
  const sumOf = (type) =>
    transactions
      .filter((item) => item.type === type)
      .reduce((sum, item) => sum + item.amount, 0);

  return { income: sumOf("income"), expense: sumOf("expense") };
}

export function getShortMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "en-IN",
    { month: "short" },
  );
}

export function getMonthlyTotals(transactions, monthCount = 6) {
  const now = new Date();

  return Array.from({ length: monthCount }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (monthCount - 1 - index),
      1,
    );
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const key = `${date.getFullYear()}-${month}`;
    const { income, expense } = getTotals(filterByMonth(transactions, key));

    return {
      month: getShortMonthLabel(key),
      Income: income,
      Expenses: expense,
    };
  });
}
