export function useMonthlyIncome() {
  const income = useState<number>('monthly-income', () => 0)

  // Load from localStorage on client
  if (import.meta.client) {
    const saved = localStorage.getItem('finance-helper-income')
    if (saved) {
      const parsed = Number(saved)
      if (!isNaN(parsed)) income.value = parsed
    }

    watch(income, (val) => {
      localStorage.setItem('finance-helper-income', String(val))
    })
  }

  return income
}
