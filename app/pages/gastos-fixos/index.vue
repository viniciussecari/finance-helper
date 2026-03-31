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
      <MockChart
        title="Gastos por Categoria"
        type="donut"
        :data="categoryData"
      />
      <MockChart
        title="Resumo por Status"
        type="bar"
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
          @delete="removeExpense(expense.id)"
          @update-value="(val) => updateExpense(expense.id, { value: val })"
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
    { label: 'Pagos', value: paidTotal.value, color: 'bg-green-500' },
    { label: 'Pendentes', value: pendingTotal.value, color: 'bg-amber-500' },
  ]
})
</script>
