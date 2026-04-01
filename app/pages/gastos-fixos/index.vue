<template>
  <div class="space-y-8">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ expenses.length }} gastos cadastrados &middot; Total:
          <span class="font-semibold text-gray-900 dark:text-white">{{ formattedTotal }}</span>
        </p>
      </div>
      <NuxtLink to="/gastos-fixos/novo">
        <UButton label="Novo Gasto" icon="i-heroicons-plus" color="primary" />
      </NuxtLink>
    </div>

    <!-- Charts (only show when there are expenses) -->
    <section v-if="expenses.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DonutChart
        title="Gastos por Categoria"
        :data="categoryData"
      />
      <BarChart
        title="Resumo por Status"
        :data="statusData"
      />
    </section>

    <!-- Filters -->
    <div v-if="expenses.length > 0" class="flex flex-wrap gap-2">
      <UButton
        v-for="cat in categories"
        :key="cat"
        :label="cat"
        :variant="selectedCategory === cat ? 'solid' : 'outline'"
        :color="selectedCategory === cat ? 'primary' : 'neutral'"
        size="sm"
        @click="selectedCategory = selectedCategory === cat ? '' : cat"
      />
    </div>

    <!-- Expense List -->
    <section>
      <div class="space-y-3">
        <ExpenseListItem
          v-for="expense in filteredExpenses"
          :key="expense.id"
          :name="expense.name"
          :value="expense.value"
          :category="expense.category"
          :due-day="expense.dueDay ? `dia ${String(expense.dueDay).padStart(2, '0')}` : ''"
          :status="expense.status"
          :editable="true"
          :status-options="statusOptions"
          @delete="handleDelete(expense)"
          @update-value="(val) => handleUpdateValue(expense, val)"
          @update-status="(status) => handleUpdateStatus(expense, status)"
        />
      </div>

      <div v-if="!filteredExpenses.length" class="text-center py-12">
        <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {{ expenses.length === 0 ? 'Nenhum gasto cadastrado ainda. Adicione seu primeiro gasto!' : 'Nenhum gasto encontrado nesta categoria.' }}
        </p>
        <NuxtLink v-if="expenses.length === 0" to="/gastos-fixos/novo" class="mt-4 inline-block">
          <UButton label="Adicionar Gasto" icon="i-heroicons-plus" variant="outline" color="primary" />
        </NuxtLink>
      </div>
    </section>

    <!-- Summary Cards -->
    <section v-if="expenses.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        label="Total Fixo Mensal"
        :value="total"
        icon="i-heroicons-banknotes"
        color="red"
      />
      <MetricCard
        label="Pagos"
        :value="paidTotal"
        icon="i-heroicons-check-circle"
        color="green"
      />
      <MetricCard
        label="Pendentes"
        :value="pendingTotal"
        icon="i-heroicons-clock"
        color="amber"
      />
    </section>
  </div>
</template>

<script setup>
const toast = useToast()
const { expenses, removeExpense, updateExpense, total, paidTotal, pendingTotal } = useExpenses()

const selectedCategory = ref('')

const categories = computed(() => {
  const cats = [...new Set(expenses.value.map((e) => e.category))]
  return cats.length > 0 ? ['Todos', ...cats] : []
})

const filteredExpenses = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === 'Todos') return expenses.value
  return expenses.value.filter((e) => e.category === selectedCategory.value)
})

const formattedTotal = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total.value)
})

const categoryData = computed(() => {
  const map = {}
  expenses.value.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.value
  })
  return Object.entries(map).map(([label, value]) => ({ label, value }))
})

const statusData = computed(() => {
  return [
    { label: 'Pagos', value: paidTotal.value, color: '#22c55e' },
    { label: 'Pendentes', value: pendingTotal.value, color: '#f59e0b' },
  ]
})

const statusOptions = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Pago', value: 'paid' },
]

function handleDelete(expense) {
  removeExpense(expense.id)
  toast.add({
    title: 'Gasto removido',
    description: `"${expense.name}" foi removido com sucesso.`,
    icon: 'i-heroicons-trash',
    color: 'error',
  })
}

function handleUpdateValue(expense, newValue) {
  const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newValue)
  updateExpense(expense.id, { value: newValue })
  toast.add({
    title: 'Valor atualizado',
    description: `"${expense.name}" atualizado para ${formatted}.`,
    icon: 'i-heroicons-pencil-square',
    color: 'success',
  })
}

function handleUpdateStatus(expense, newStatus) {
  updateExpense(expense.id, { status: newStatus })
  toast.add({
    title: 'Status atualizado',
    description: `Status de "${expense.name}" atualizado para ${newStatus === 'paid' ? 'Pago' : 'Pendente'}.`,
    icon: 'i-heroicons-check-circle',
    color: 'success',
  })
}
</script>
