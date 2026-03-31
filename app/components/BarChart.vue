<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <span v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400">{{ subtitle }}</span>
    </div>
    <div class="h-52">
      <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
      <div v-else class="h-full flex items-center justify-center text-sm text-gray-400">Sem dados</div>
    </div>
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  data: { type: Array, default: () => [] },
})

const chartData = computed(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      data: props.data.map((d) => d.value),
      backgroundColor: props.data.map((d) => d.color || '#6366f1'),
      borderRadius: 8,
      maxBarThickness: 40,
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
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ctx.raw)
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (val) => 'R$ ' + val.toLocaleString('pt-BR'),
      },
      grid: { color: 'rgba(156, 163, 175, 0.1)' },
    },
    x: {
      grid: { display: false },
    },
  },
}
</script>
