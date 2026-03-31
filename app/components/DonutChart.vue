<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <span v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400">{{ subtitle }}</span>
    </div>
    <div class="flex items-center gap-6">
      <div class="w-40 h-40 flex-shrink-0">
        <Doughnut v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
        <div v-else class="h-full flex items-center justify-center text-sm text-gray-400">Sem dados</div>
      </div>
      <div class="flex flex-col gap-2 flex-1 min-w-0">
        <div v-for="(item, index) in data" :key="index" class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: colors[index % colors.length] }" />
          <span class="text-xs text-gray-600 dark:text-gray-400 truncate flex-1">{{ item.label }}</span>
          <span class="text-xs font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  data: { type: Array, default: () => [] },
})

const colors = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#a855f7',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
]

const chartData = computed(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      data: props.data.map((d) => d.value),
      backgroundColor: props.data.map((_, i) => colors[i % colors.length]),
      borderWidth: 0,
      cutout: '70%',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const val = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ctx.raw)
          return `${ctx.label}: ${val}`
        },
      },
    },
  },
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}
</script>
