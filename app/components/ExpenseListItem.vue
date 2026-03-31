<template>
  <div
    class="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow"
  >
    <div
      class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
      :class="categoryBgClass"
    >
      <UIcon :name="categoryIcon" class="w-5 h-5" :class="categoryColorClass" />
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ name }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ category }} &middot; Vence {{ dueDay }}</p>
    </div>

    <div class="text-right flex-shrink-0">
      <p class="text-sm font-bold text-gray-900 dark:text-white">{{ formattedValue }}</p>
      <span
        class="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
        :class="statusClasses"
      >
        {{ statusLabel }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  category: { type: String, default: 'Outros' },
  dueDay: { type: String, default: '' },
  status: { type: String, default: 'pending' },
})

const categoryConfigs = {
  Moradia: { icon: 'i-heroicons-home', bg: 'bg-blue-100 dark:bg-blue-900', color: 'text-blue-600 dark:text-blue-400' },
  Transporte: { icon: 'i-heroicons-truck', bg: 'bg-amber-100 dark:bg-amber-900', color: 'text-amber-600 dark:text-amber-400' },
  Alimentação: { icon: 'i-heroicons-cake', bg: 'bg-green-100 dark:bg-green-900', color: 'text-green-600 dark:text-green-400' },
  Saúde: { icon: 'i-heroicons-heart', bg: 'bg-red-100 dark:bg-red-900', color: 'text-red-600 dark:text-red-400' },
  Educação: { icon: 'i-heroicons-academic-cap', bg: 'bg-purple-100 dark:bg-purple-900', color: 'text-purple-600 dark:text-purple-400' },
  Lazer: { icon: 'i-heroicons-musical-note', bg: 'bg-pink-100 dark:bg-pink-900', color: 'text-pink-600 dark:text-pink-400' },
  Assinaturas: { icon: 'i-heroicons-credit-card', bg: 'bg-indigo-100 dark:bg-indigo-900', color: 'text-indigo-600 dark:text-indigo-400' },
  Outros: { icon: 'i-heroicons-ellipsis-horizontal-circle', bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-600 dark:text-gray-400' },
}

const statusConfig = {
  paid: { label: 'Pago', classes: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  pending: { label: 'Pendente', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  overdue: { label: 'Atrasado', classes: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
}

const catConfig = computed(() => categoryConfigs[props.category] || categoryConfigs.Outros)
const categoryIcon = computed(() => catConfig.value.icon)
const categoryBgClass = computed(() => catConfig.value.bg)
const categoryColorClass = computed(() => catConfig.value.color)

const statusLabel = computed(() => statusConfig[props.status]?.label || 'Pendente')
const statusClasses = computed(() => statusConfig[props.status]?.classes || statusConfig.pending.classes)

const formattedValue = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.value)
})
</script>
