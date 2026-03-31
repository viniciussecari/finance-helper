export function useMonthlyIncome() {
  return useState<number>('monthly-income', () => 5200)
}
