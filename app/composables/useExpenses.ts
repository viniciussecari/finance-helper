export interface Expense {
  id: string
  name: string
  value: number
  category: string
  dueDay: number | null
  status: 'pending' | 'paid' | 'overdue'
  notes: string
  recurring: boolean
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

export function useExpenses() {
  const expenses = useState<Expense[]>('expenses', () => [])

  // Load from localStorage on client
  if (import.meta.client) {
    const saved = localStorage.getItem('finance-helper-expenses')
    if (saved) {
      try {
        expenses.value = JSON.parse(saved)
      } catch {
        // ignore invalid JSON
      }
    }

    // Watch and persist
    watch(expenses, (val) => {
      localStorage.setItem('finance-helper-expenses', JSON.stringify(val))
    }, { deep: true })
  }

  function addExpense(data: Omit<Expense, 'id'>) {
    expenses.value.push({ ...data, id: generateId() })
  }

  function removeExpense(id: string) {
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  function updateExpense(id: string, data: Partial<Omit<Expense, 'id'>>) {
    const index = expenses.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      const existing = expenses.value[index]!
      expenses.value.splice(index, 1, { ...existing, ...data })
    }
  }

  const total = computed(() => expenses.value.reduce((acc, e) => acc + e.value, 0))
  const paidTotal = computed(() => expenses.value.filter((e) => e.status === 'paid').reduce((acc, e) => acc + e.value, 0))
  const pendingTotal = computed(() => expenses.value.filter((e) => e.status !== 'paid').reduce((acc, e) => acc + e.value, 0))

  return {
    expenses,
    addExpense,
    removeExpense,
    updateExpense,
    total,
    paidTotal,
    pendingTotal,
  }
}
