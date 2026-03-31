export function useMonthlyIncome() {
  const income = useState<number>('monthly-income', () => 0)
  const loaded = useState<boolean>('monthly-income-loaded', () => false)

  if (import.meta.client && !loaded.value) {
    const saved = localStorage.getItem('finance-helper-income')
    if (saved) {
      const parsed = Number(saved)
      if (!isNaN(parsed)) income.value = parsed
    }
    loaded.value = true

    watch(income, (val) => {
      localStorage.setItem('finance-helper-income', String(val))
    })
  }

  return income
}
