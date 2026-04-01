<template>
  <div class="space-y-8">
    <!-- Greeting Section -->
    <section>
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-gray-900 dark:text-white">Olá,</span>
        <input 
          v-model="userName" 
          placeholder="convidado" 
          class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 bg-transparent focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 rounded-lg px-2 -ml-2 transition-colors w-full sm:w-auto"
        />
      </div>
    </section>

    <!-- Metric Cards -->
    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Renda Mensal"
          :value="monthlyIncome"
          icon="i-heroicons-arrow-trending-up"
          color="green"
          description="Editável no topo da página"
        />
        <MetricCard
          label="Gastos Fixos"
          :value="total"
          icon="i-heroicons-banknotes"
          color="red"
          :description="`${expenses.length} gastos cadastrados`"
        />
        <MetricCard
          label="Saldo Livre"
          :value="saldoLivre"
          icon="i-heroicons-wallet"
          color="indigo"
          description="Disponível para usar"
        />
        <MetricCard
          label="Comprometido"
          :value="comprometido"
          icon="i-heroicons-chart-pie"
          color="amber"
          format="percent"
          description="Da renda mensal"
        />
      </div>
    </section>

    <!-- Charts Section (only show with data) -->
    <section v-if="expenses.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DonutChart
      title="Gastos por Categoria"
      subtitle="Mês atual"
      :data="categoryExpenses"
      />
      <DonutChart
        title="Renda para Cofrinhos"
        subtitle="Mês atual"
        :data="piggyBankDonutData"
      />
    </section>

    <!-- Cofrinhos Section -->
    <section v-if="piggyBanks.length > 0">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meus Cofrinhos</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="cofrinho in recentPiggyBanks" 
          :key="cofrinho.id" 
          class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold">{{ cofrinho.name }}</span>
            <span class="text-sm font-bold text-green-600 dark:text-green-400">{{ Math.round(calculateProgress(cofrinho.saved, cofrinho.goal)) }}%</span>
          </div>
          <CustomProgressBar :value="cofrinho.saved" :max="cofrinho.goal" />
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>{{ formatCurrency(cofrinho.saved) }}</span>
            <span>{{ formatCurrency(cofrinho.goal) }}</span>
          </div>
        </div>
      </div>
      <div class="text-center mt-6">
        <UButton 
          label="Ver todos os cofrinhos" 
          variant="ghost" 
          color="primary"
          icon="i-heroicons-arrow-right-circle"
          trailing
          @click="navigateTo('/cofrinhos')" 
        />
      </div>
    </section>
    
    <section v-if="piggyBanks.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-archive-box" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Comece a organizar suas finanças</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Organize cofrinhos e suas metas.
      </p>
      <div class="mt-6 flex justify-center items-center gap-4">
        <NuxtLink to="/cofrinhos/novo">
          <UButton label="Criar Cofrinho" icon="i-heroicons-archive-box" color="primary" variant="outline" />
        </NuxtLink>
      </div>
    </section>

    <!-- Insights -->
    <section>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dicas e Alertas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard
          v-if="monthlyIncome === 0"
          title="Configure sua renda"
          description="Insira seu valor total mensal no campo no topo da página para ver seus cálculos financeiros."
          icon="i-heroicons-information-circle"
          type="info"
        />
        <InsightCard
          v-if="expenses.length === 0"
          title="Adicione seus gastos"
          description="Vá para a seção de Gastos Fixos e cadastre suas contas mensais para acompanhar suas finanças."
          icon="i-heroicons-plus-circle"
          type="info"
          action-label="Ir para Gastos Fixos"
          @action="navigateTo('/gastos-fixos/novo')"
        />
        <InsightCard
          v-if="comprometido > 80"
          title="Renda muito comprometida"
          description="Mais de 80% da sua renda está comprometida com gastos fixos. Revise seus gastos."
          icon="i-heroicons-exclamation-triangle"
          type="warning"
        />
        <InsightCard
          v-if="saldoLivre < 0"
          title="Saldo negativo!"
          description="Seus gastos fixos excedem sua renda mensal. Corte gastos ou aumente sua renda."
          icon="i-heroicons-x-circle"
          type="warning"
        />
        <InsightCard
          v-if="pendingTotal > 0"
          title="Contas pendentes"
          :description="`Você tem ${formatCurrency(pendingTotal)} em contas pendentes de pagamento.`"
          icon="i-heroicons-clock"
          type="info"
          action-label="Ver gastos"
          @action="navigateTo('/gastos-fixos')"
        />
        <InsightCard
          v-if="comprometido > 0 && comprometido <= 60"
          title="Boa saúde financeira"
          description="Menos de 60% da sua renda está comprometida. Continue administrando bem!"
          icon="i-heroicons-check-circle"
          type="success"
        />
      </div>
    </section>

    <!-- Recent Expenses -->
    <section v-if="expenses.length > 0">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Últimos Gastos</h2>
        <NuxtLink to="/gastos-fixos" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Ver todos
        </NuxtLink>
      </div>
      <div class="space-y-3">
        <ExpenseListItem
          v-for="expense in recentExpenses"
          :key="expense.id"
          :name="expense.name"
          :value="expense.value"
          :category="expense.category"
          :due-day="expense.dueDay ? `dia ${String(expense.dueDay).padStart(2, '0')}` : ''"
          :status="expense.status"
        />
      </div>
    </section>

    <!-- Empty state -->
    <section v-if="expenses.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-chart-bar" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Comece a organizar suas finanças</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Configure sua renda mensal no topo e adicione seus gastos fixos.
      </p>
      <div class="mt-6 flex justify-center items-center gap-4">
        <NuxtLink to="/gastos-fixos/novo">
          <UButton label="Adicionar Gasto" icon="i-heroicons-plus" color="primary" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const monthlyIncome = useMonthlyIncome()
const { expenses, total, paidTotal, pendingTotal } = useExpenses()
const userName = useUserName()
const { piggyBanks } = useCofrinhos()

const saldoLivre = computed(() => monthlyIncome.value - total.value)
const comprometido = computed(() => {
  if (!monthlyIncome.value) return 0
  return Math.round((total.value / monthlyIncome.value) * 1000) / 10
})

const recentExpenses = computed(() => {
  return expenses.value.slice(-5).reverse()
})

const recentPiggyBanks = computed(() => {
  return piggyBanks.value.slice(0, 2)
})

const categoryExpenses = computed(() => {
  const map = {}
  expenses.value.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.value
  })
  return Object.entries(map).map(([label, value]) => ({ label, value }))
})

const summaryData = computed(() => {
  return [
    { label: 'Renda', value: monthlyIncome.value, color: '#22c55e' },
    { label: 'Gastos', value: total.value, color: '#ef4444' },
    { label: 'Saldo', value: Math.max(saldoLivre.value, 0), color: '#6366f1' },
  ]
})

const piggyBankDonutData = computed(() => {
  const piggyBankExpenses = expenses.value.filter(e => e.category === 'Cofrinho').reduce((acc, e) => acc + e.value, 0);
  const remainingIncome = monthlyIncome.value - piggyBankExpenses;

  return [
    { label: 'Cofrinhos', value: piggyBankExpenses, color: '#3b82f6' },
    { label: 'Restante', value: remainingIncome, color: '#6b7280' },
  ];
});

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function calculateProgress(saved, goal) {
  if (!goal || goal === 0) return 0
  return Math.min((saved / goal) * 100, 100)
}

</script>
