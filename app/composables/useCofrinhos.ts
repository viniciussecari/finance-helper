// Define the structure for a single PiggyBank item
export interface PiggyBank {
  id: string
  name: string
  goal: number
  saved: number
  category: string
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

export function useCofrinhos() {
  const piggyBanks = useState<PiggyBank[]>('piggyBanks', () => [])
  const loaded = useState<boolean>('cofrinhos-loaded', () => false)

  // Function to manually save data to localStorage
  function save() {
    if (import.meta.client) {
      console.log('SAVING PIGGYBANKS TO LOCALSTORAGE...')
      localStorage.setItem('finance-helper-cofrinhos', JSON.stringify(piggyBanks.value))
    }
  }

  // Load initial data from localStorage
  if (import.meta.client && !loaded.value) {
    const saved = localStorage.getItem('finance-helper-cofrinhos')
    if (saved) {
      try {
        piggyBanks.value = JSON.parse(saved)
      } catch {
        // ignore invalid JSON
      }
    }
    loaded.value = true
  }

  function addPiggyBank(data: Omit<PiggyBank, 'id'>) {
    const newPiggyBank: PiggyBank = {
      ...data,
      id: generateId(),
    }
    piggyBanks.value.push(newPiggyBank)
    save()
  }

  function removePiggyBank(id: string) {
    piggyBanks.value = piggyBanks.value.filter((p) => p.id !== id)
    save()
  }

  function updatePiggyBank(id: string, data: Partial<Omit<PiggyBank, 'id'>>) {
    piggyBanks.value = piggyBanks.value.map((p) => {
      if (p.id === id) {
        return { ...p, ...data }
      }
      return p
    })
    save()
  }

  const getPiggyBank = (id: string) => {
    return piggyBanks.value.find((p) => p.id === id)
  }

  // --- Computed Properties for summaries ---

  // Total goal amount across all piggy banks
  const totalGoal = computed(() => {
    return piggyBanks.value.reduce((sum, p) => sum + p.goal, 0)
  })

  // Total saved amount across all piggy banks
  const totalSaved = computed(() => {
    return piggyBanks.value.reduce((sum, p) => sum + p.saved, 0)
  })

  // Total remaining amount to reach all goals
  const totalRemaining = computed(() => {
    return totalGoal.value - totalSaved.value
  })

  return {
    piggyBanks,
    loaded,
    addPiggyBank,
    removePiggyBank,
    updatePiggyBank,
    getPiggyBank,
    totalGoal,
    totalSaved,
    totalRemaining,
  }
}
