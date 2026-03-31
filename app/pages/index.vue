<template>
  <div class="space-y-8">
    <!-- Metric Cards -->
    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Renda Mensal"
          :value="5200"
          icon="i-heroicons-arrow-trending-up"
          color="green"
          :trend="3.2"
          description="vs. mês anterior"
        />
        <MetricCard
          label="Gastos Fixos"
          :value="3150"
          icon="i-heroicons-banknotes"
          color="red"
          :trend="-1.5"
          description="vs. mês anterior"
        />
        <MetricCard
          label="Saldo Livre"
          :value="2050"
          icon="i-heroicons-wallet"
          color="indigo"
          description="Disponível para usar"
        />
        <MetricCard
          label="Comprometido"
          :value="60.6"
          icon="i-heroicons-chart-pie"
          color="amber"
          format="percent"
          description="Da renda mensal"
        />
      </div>
    </section>

    <!-- Charts Section -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MockChart
        title="Gastos por Mês"
        subtitle="Últimos 6 meses"
        type="bar"
        :data="monthlyExpenses"
      />
      <MockChart
        title="Gastos por Categoria"
        subtitle="Mês atual"
        type="donut"
        :data="categoryExpenses"
      />
    </section>

    <!-- Insights -->
    <section>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dicas e Alertas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard
          title="Gasto acima da média"
          description="Seus gastos com Assinaturas aumentaram 15% neste mês. Considere revisar serviços que não usa."
          icon="i-heroicons-exclamation-triangle"
          type="warning"
          action-label="Ver detalhes"
        />
        <InsightCard
          title="Boa notícia!"
          description="Você economizou R$ 200 em Alimentação comparado ao mês passado. Continue assim!"
          icon="i-heroicons-check-circle"
          type="success"
        />
        <InsightCard
          title="Conta próxima do vencimento"
          description="Sua conta de Energia vence em 3 dias. Valor: R$ 180,00."
          icon="i-heroicons-clock"
          type="info"
          action-label="Marcar como paga"
        />
        <InsightCard
          title="Cashback disponível"
          description="Você tem R$ 45,00 de cashback acumulado no cartão. Resgate antes do final do mês."
          icon="i-heroicons-gift"
          type="promo"
          action-label="Ver cashback"
        />
      </div>
    </section>

    <!-- Recent Expenses -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Últimos Gastos</h2>
        <NuxtLink to="/gastos-fixos" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Ver todos
        </NuxtLink>
      </div>
      <div class="space-y-3">
        <ExpenseListItem
          v-for="expense in recentExpenses"
          :key="expense.name"
          :name="expense.name"
          :value="expense.value"
          :category="expense.category"
          :due-day="expense.dueDay"
          :status="expense.status"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const monthlyExpenses = [
  { label: 'Out', value: 2800, color: 'bg-indigo-400' },
  { label: 'Nov', value: 3100, color: 'bg-indigo-400' },
  { label: 'Dez', value: 3400, color: 'bg-indigo-400' },
  { label: 'Jan', value: 3000, color: 'bg-indigo-400' },
  { label: 'Fev', value: 2950, color: 'bg-indigo-400' },
  { label: 'Mar', value: 3150, color: 'bg-indigo-500' },
]

const categoryExpenses = [
  { label: 'Moradia', value: 1200 },
  { label: 'Transporte', value: 600 },
  { label: 'Alimentação', value: 500 },
  { label: 'Assinaturas', value: 350 },
  { label: 'Saúde', value: 300 },
  { label: 'Outros', value: 200 },
]

const recentExpenses = [
  { name: 'Aluguel', value: 1200, category: 'Moradia', dueDay: 'dia 05', status: 'paid' },
  { name: 'Plano de Saúde', value: 300, category: 'Saúde', dueDay: 'dia 10', status: 'paid' },
  { name: 'Energia', value: 180, category: 'Moradia', dueDay: 'dia 15', status: 'pending' },
  { name: 'Internet', value: 120, category: 'Assinaturas', dueDay: 'dia 20', status: 'pending' },
  { name: 'Gasolina', value: 350, category: 'Transporte', dueDay: 'dia 25', status: 'pending' },
]
</script>
