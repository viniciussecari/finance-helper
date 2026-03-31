const monthlyIncome = useState<number>('monthly-income', () => 5200)

export function useMonthlyIncome() {
  return monthlyIncome
}
