<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Form -->
    <div class="lg:col-span-2 space-y-6">
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Dados do Gasto</h2>

        <div class="space-y-5">
          <UFormField label="Nome do gasto">
            <UInput
              v-model="form.name"
              placeholder="Ex: Aluguel, Netflix, Academia..."
              size="lg"
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Valor (R$)">
              <UInput
                v-model.number="form.value"
                type="number"
                placeholder="0,00"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Categoria">
              <USelect
                v-model="form.category"
                :items="categoryOptions"
                placeholder="Selecione..."
                size="lg"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Dia de vencimento">
              <UInput
                v-model.number="form.dueDay"
                type="number"
                min="1"
                max="31"
                placeholder="Ex: 10"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Status">
              <USelect
                v-model="form.status"
                :items="statusOptions"
                size="lg"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField label="Observações (opcional)">
            <UTextarea
              v-model="form.notes"
              placeholder="Anotações sobre este gasto..."
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center gap-3 pt-2">
            <UCheckbox v-model="form.recurring" label="Gasto recorrente (repete todo mês)" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <NuxtLink to="/gastos-fixos">
          <UButton label="Cancelar" variant="outline" color="neutral" />
        </NuxtLink>
        <UButton label="Salvar Gasto" icon="i-heroicons-check" color="primary" @click="handleSave" />
      </div>
    </div>

    <!-- Impact Panel -->
    <div class="space-y-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Impacto no Fluxo
        </h3>

        <div class="space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Renda mensal</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(income) }}</span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Gastos atuais</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(currentExpenses) }}</span>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Novo gasto</span>
            <span class="font-medium" :class="form.value > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'">
              {{ form.value > 0 ? '+ ' + formatCurrency(form.value) : 'R$ 0,00' }}
            </span>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-800 pt-3">
            <div class="flex justify-between text-sm">
              <span class="font-semibold text-gray-900 dark:text-white">Novo saldo livre</span>
              <span
                class="font-bold"
                :class="newBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
              >
                {{ formatCurrency(newBalance) }}
              </span>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="mt-2">
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Comprometimento</span>
              <span>{{ commitPercent }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="commitColor"
                :style="{ width: Math.min(commitPercent, 100) + '%' }"
              />
            </div>
          </div>

          <!-- Alert -->
          <div
            v-if="form.value > 0 && newBalance < 0"
            class="mt-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p class="text-xs text-red-700 dark:text-red-300 font-medium">
              Atenção: Este gasto excede seu saldo disponível em {{ formatCurrency(Math.abs(newBalance)) }}.
            </p>
          </div>

          <div
            v-else-if="form.value > 0 && commitPercent > 80"
            class="mt-3 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg"
          >
            <p class="text-xs text-amber-700 dark:text-amber-300 font-medium">
              Cuidado: Com este gasto, {{ commitPercent }}% da sua renda ficará comprometida.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const income = 5200
const currentExpenses = 3147

const form = reactive({
  name: '',
  value: 0,
  category: '',
  dueDay: null,
  status: 'pending',
  notes: '',
  recurring: true,
})

const categoryOptions = [
  'Moradia',
  'Transporte',
  'Alimentação',
  'Saúde',
  'Educação',
  'Lazer',
  'Assinaturas',
  'Outros',
]

const statusOptions = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Pago', value: 'paid' },
]

const newBalance = computed(() => {
  return income - currentExpenses - (form.value || 0)
})

const commitPercent = computed(() => {
  const total = currentExpenses + (form.value || 0)
  return Math.round((total / income) * 100)
})

const commitColor = computed(() => {
  if (commitPercent.value > 90) return 'bg-red-500'
  if (commitPercent.value > 70) return 'bg-amber-500'
  return 'bg-green-500'
})

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function handleSave() {
  // Mock save - just navigate back
  router.push('/gastos-fixos')
}
</script>
