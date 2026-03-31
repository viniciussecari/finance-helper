<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <span v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400">{{ subtitle }}</span>
    </div>

    <!-- Bar Chart -->
    <div v-if="type === 'bar'" class="flex items-end gap-2 h-40">
      <div
        v-for="(bar, index) in bars"
        :key="index"
        class="flex-1 flex flex-col items-center gap-1"
      >
        <span class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
          {{ formatCurrency(bar.value) }}
        </span>
        <div
          class="w-full rounded-t-lg transition-all duration-500"
          :class="bar.color || 'bg-indigo-500 dark:bg-indigo-400'"
          :style="{ height: barHeight(bar.value) + '%' }"
        />
        <span class="text-[10px] text-gray-500 dark:text-gray-400">{{ bar.label }}</span>
      </div>
    </div>

    <!-- Donut Chart (CSS) -->
    <div v-else-if="type === 'donut'" class="flex items-center gap-6">
      <div class="relative w-32 h-32 flex-shrink-0">
        <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
          <circle
            v-for="(segment, index) in donutSegments"
            :key="index"
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            :stroke="segment.strokeColor"
            stroke-width="3.5"
            :stroke-dasharray="`${segment.percent} ${100 - segment.percent}`"
            :stroke-dashoffset="-segment.offset"
            class="transition-all duration-500"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-lg font-bold text-gray-900 dark:text-white">{{ donutTotal }}</span>
          <span class="text-[10px] text-gray-500">Total</span>
        </div>
      </div>
      <div class="flex flex-col gap-2 flex-1 min-w-0">
        <div v-for="(item, index) in data" :key="index" class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="donutColors[index % donutColors.length]" />
          <span class="text-xs text-gray-600 dark:text-gray-400 truncate flex-1">{{ item.label }}</span>
          <span class="text-xs font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.value) }}</span>
        </div>
      </div>
    </div>

    <!-- Line Chart (CSS) -->
    <div v-else-if="type === 'line'" class="h-40 flex items-end gap-1">
      <div
        v-for="(point, index) in data"
        :key="index"
        class="flex-1 flex flex-col items-center gap-1"
      >
        <div class="w-full flex justify-center">
          <div
            class="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
            :style="{ marginBottom: lineHeight(point.value) + 'px' }"
          />
        </div>
        <div class="w-full h-px bg-gray-200 dark:bg-gray-700" />
        <span class="text-[10px] text-gray-500 dark:text-gray-400">{{ point.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  type: { type: String, default: 'bar' },
  data: { type: Array, default: () => [] },
})

const donutColors = [
  'bg-indigo-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-pink-500',
]

const donutStrokeColors = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#a855f7',
  '#3b82f6',
  '#ec4899',
]

const bars = computed(() => props.data)

const maxValue = computed(() => {
  if (!props.data.length) return 1
  return Math.max(...props.data.map((d) => d.value), 1)
})

function barHeight(value) {
  return Math.max((value / maxValue.value) * 100, 4)
}

function lineHeight(value) {
  return Math.max((value / maxValue.value) * 100, 2)
}

const donutTotal = computed(() => {
  const total = props.data.reduce((acc, d) => acc + d.value, 0)
  return formatCurrency(total)
})

const donutSegments = computed(() => {
  const total = props.data.reduce((acc, d) => acc + d.value, 0)
  if (!total) return []

  let offset = 0
  return props.data.map((item, index) => {
    const percent = (item.value / total) * 100
    const segment = {
      percent,
      offset,
      strokeColor: donutStrokeColors[index % donutStrokeColors.length],
    }
    offset += percent
    return segment
  })
})

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>
