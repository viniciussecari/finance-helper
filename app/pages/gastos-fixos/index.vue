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

    <!-- Charts -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MockChart
        title="Gastos por Categoria"
        type="donut"
        :data="categoryData"
      />
      <MockChart
        title="Evolução Mensal"
        subtitle="Últimos 6 meses"
        type="bar"
        :data="monthlyData"
      />
    </section>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2">
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
          :key="expense.name"
          :name="expense.name"
          :value="expense.value"
          :category="expense.category"
          :due-day="expense.dueDay"
          :status="expense.status"
        />
      </div>

      <div v-if="!filteredExpenses.length" class="text-center py-12">
        <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Nenhum gasto encontrado nesta categoria.</p>
      </div>
    </section>

    <!-- Summary Cards -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
const selectedCategory = ref('')

const expenses = ref([
  { name: 'Aluguel', value: 1200, category: 'Moradia', dueDay: 'dia 05', status: 'paid' },
  { name: 'Condomínio', value: 450, category: 'Moradia', dueDay: 'dia 05', status: 'paid' },
  { name: 'Energia', value: 180, category: 'Moradia', dueDay: 'dia 15', status: 'pending' },
  { name: 'Água', value: 80, category: 'Moradia', dueDay: 'dia 20', status: 'pending' },
  { name: 'Internet', value: 120, category: 'Assinaturas', dueDay: 'dia 20', status: 'pending' },
  { name: 'Streaming', value: 55, category: 'Assinaturas', dueDay: 'dia 10', status: 'paid' },
  { name: 'Spotify', value: 22, category: 'Assinaturas', dueDay: 'dia 10', status: 'paid' },
  { name: 'Plano de Saúde', value: 300, category: 'Saúde', dueDay: 'dia 10', status: 'paid' },
  { name: 'Academia', value: 90, category: 'Saúde', dueDay: 'dia 01', status: 'paid' },
  { name: 'Gasolina', value: 350, category: 'Transporte', dueDay: 'dia 25', status: 'pending' },
  { name: 'Seguro Auto', value: 180, category: 'Transporte', dueDay: 'dia 15', status: 'paid' },
  { name: 'Curso Online', value: 120, category: 'Educação', dueDay: 'dia 01', status: 'paid' },
])

const categories = computed(() => {
  const cats = [...new Set(expenses.value.map((e) => e.category))]
  return ['Todos', ...cats]
})

const filteredExpenses = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === 'Todos') return expenses.value
  return expenses.value.filter((e) => e.category === selectedCategory.value)
})

const total = computed(() => expenses.value.reduce((acc, e) => acc + e.value, 0))
const paidTotal = computed(() => expenses.value.filter((e) => e.status === 'paid').reduce((acc, e) => acc + e.value, 0))
const pendingTotal = computed(() => expenses.value.filter((e) => e.status === 'pending').reduce((acc, e) => acc + e.value, 0))

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

const monthlyData = [
  { label: 'Out', value: 2800 },
  { label: 'Nov', value: 3100 },
  { label: 'Dez', value: 3400 },
  { label: 'Jan', value: 3000 },
  { label: 'Fev', value: 2950 },
  { label: 'Mar', value: 3147 },
]
</script>
