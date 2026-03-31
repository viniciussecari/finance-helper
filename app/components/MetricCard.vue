<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col gap-3 transition-shadow hover:shadow-md"
  >
    <div class="flex items-center justify-between">
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center"
        :class="iconBgClass"
      >
        <UIcon :name="icon" class="w-5 h-5" :class="iconColorClass" />
      </div>
      <span
        v-if="trend !== undefined"
        class="text-xs font-semibold px-2 py-0.5 rounded-full"
        :class="trend >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'"
      >
        {{ trend >= 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</p>
      <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formattedValue }}</p>
    </div>
    <p v-if="description" class="text-xs text-gray-400 dark:text-gray-500">{{ description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  icon: { type: String, default: 'i-heroicons-currency-dollar' },
  color: { type: String, default: 'indigo' },
  trend: { type: Number, default: undefined },
  description: { type: String, default: '' },
  format: { type: String, default: 'currency' },
})

const colorMap = {
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-600 dark:text-indigo-400' },
  green: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-600 dark:text-green-400' },
  red: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-600 dark:text-red-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-600 dark:text-amber-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-600 dark:text-blue-400' },
}

const iconBgClass = computed(() => colorMap[props.color]?.bg || colorMap.indigo.bg)
const iconColorClass = computed(() => colorMap[props.color]?.text || colorMap.indigo.text)

const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.value)
  }
  if (props.format === 'percent') {
    return `${props.value}%`
  }
  return props.value.toLocaleString('pt-BR')
})
</script>
