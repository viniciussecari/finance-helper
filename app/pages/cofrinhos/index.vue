<template>
  <div class="space-y-8">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Meus Cofrinhos</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ piggyBanks.length }} cofrinhos cadastrados
        </p>
      </div>
      <NuxtLink to="/cofrinhos/novo">
        <UButton label="Novo Cofrinho" icon="i-heroicons-plus-circle" color="primary" />
      </NuxtLink>
    </div>

    <!-- Summary Cards -->
    <section v-if="piggyBanks.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        label="Meta Total"
        :value="totalGoal"
        icon="i-heroicons-flag"
        color="blue"
      />
      <MetricCard
        label="Total Guardado"
        :value="totalSaved"
        icon="i-heroicons-banknotes"
        color="green"
      />
      <MetricCard
        label="Faltam"
        :value="totalRemaining"
        icon="i-heroicons-bars-arrow-down"
        color="amber"
      />
    </section>

    <!-- PiggyBank List -->
    <section>
      <div class="space-y-3">
        <div
          v-for="piggyBank in piggyBanks"
          :key="piggyBank.id"
          class="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        >
          <div class="flex justify-between items-start gap-2">
            <div>
              <span class="font-semibold text-gray-900 dark:text-white">{{ piggyBank.name }}</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatCurrency(piggyBank.saved) }} / {{ formatCurrency(piggyBank.goal) }}</p>
            </div>
            <div class="flex items-center -mr-2">
              <NuxtLink :to="`/cofrinhos/novo?id=${piggyBank.id}`">
                <UButton icon="i-heroicons-pencil-square" size="sm" color="blue" variant="ghost" />
              </NuxtLink>
              <UButton icon="i-heroicons-trash" size="sm" color="red" variant="ghost" @click="handleDelete(piggyBank)" />
            </div>
          </div>
          <CustomProgressBar :value="piggyBank.saved" :max="piggyBank.goal" class="mt-2" />
        </div>
      </div>

      <div v-if="!piggyBanks.length" class="text-center py-12">
        <UIcon name="i-heroicons-archive-box" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Você ainda não tem cofrinhos. Crie sua primeira economia!
        </p>
        <NuxtLink to="/cofrinhos/novo" class="mt-4 inline-block">
          <UButton label="Criar Cofrinho" icon="i-heroicons-plus" variant="outline" color="primary" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useCofrinhos } from '~/composables/useCofrinhos'

const toast = useToast()
const { piggyBanks, totalGoal, totalSaved, totalRemaining, removePiggyBank } = useCofrinhos()

function handleDelete(piggyBank) {
  removePiggyBank(piggyBank.id)
  toast.add({
    title: 'Cofrinho removido',
    description: `"${piggyBank.name}" foi removido com sucesso.`,
    icon: 'i-heroicons-trash',
    color: 'error',
  })
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}


useHead({
  title: 'Meus Cofrinhos',
})
</script>
