<template>
  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
    <div class="bg-green-600 h-2.5 rounded-full transition-all duration-500" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
})

const progress = computed(() => {
  if (!props.max || props.max === 0) {
    return 0
  }
  return Math.min((props.value / props.max) * 100, 100)
})
</script>
