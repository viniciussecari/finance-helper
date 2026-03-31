<template>
  <div
    class="rounded-2xl border p-5 flex gap-4 items-start transition-shadow hover:shadow-md"
    :class="cardClasses"
  >
    <div
      class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
      :class="iconBgClass"
    >
      <UIcon :name="icon" class="w-5 h-5" :class="iconColorClass" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold" :class="titleColorClass">{{ title }}</p>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ description }}</p>
      <UButton
        v-if="actionLabel"
        :label="actionLabel"
        variant="link"
        size="xs"
        class="mt-2 px-0"
        :class="actionColorClass"
        @click="$emit('action')"
      />
    </div>
  </div>
</template>

<script setup>
defineEmits(['action'])

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'i-heroicons-light-bulb' },
  type: { type: String, default: 'info' },
  actionLabel: { type: String, default: '' },
})

const typeConfig = {
  info: {
    card: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
    actionColor: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    card: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-900 dark:text-green-100',
    actionColor: 'text-green-600 dark:text-green-400',
  },
  warning: {
    card: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-100',
    actionColor: 'text-amber-600 dark:text-amber-400',
  },
  promo: {
    card: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400',
    titleColor: 'text-purple-900 dark:text-purple-100',
    actionColor: 'text-purple-600 dark:text-purple-400',
  },
}

const config = computed(() => typeConfig[props.type] || typeConfig.info)

const cardClasses = computed(() => config.value.card)
const iconBgClass = computed(() => config.value.iconBg)
const iconColorClass = computed(() => config.value.iconColor)
const titleColorClass = computed(() => config.value.titleColor)
const actionColorClass = computed(() => config.value.actionColor)
</script>
