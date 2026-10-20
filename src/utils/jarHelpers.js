export function getFillPercent(balance, limit) {
  if (limit <= 0) return 0;
  return (balance / limit) * 100;
}
