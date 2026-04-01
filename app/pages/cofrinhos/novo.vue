<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Form -->
    <div class="lg:col-span-2 space-y-6">
      <div class="bg-blue-50/50 dark:bg-gray-900 rounded-2xl border border-blue-200 dark:border-gray-800 p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">{{ isEditing ? 'Editar Cofrinho' : 'Novo Cofrinho' }}</h2>

        <div class="space-y-5">
          <UFormField label="Nome da economia">
            <UInput
              v-model="form.name"
              placeholder="Ex: Viagem, Carro novo, Notebook..."
              size="lg"
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Meta de valor (R$)">
              <UInput
                v-model.number="form.goal"
                type="number"
                placeholder="1.000,00"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Valor já guardado (R$)">
              <UInput
                v-model.number="form.saved"
                type="number"
                placeholder="0,00"
                size="lg"
                class="w-full"
              />
            </UFormField>
          </div>

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
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <NuxtLink to="/cofrinhos">
          <UButton label="Cancelar" variant="outline" color="neutral" />
        </NuxtLink>
        <UButton :label="isEditing ? 'Salvar Alterações' : 'Salvar Cofrinho'" icon="i-heroicons-check" color="primary" @click="handleSave" />
      </div>
    </div>

    <!-- Summary Panel -->
    <div class="space-y-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Resumo da Meta
        </h3>

        <div v-if="form.goal > 0" class="space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Meta</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(form.goal) }}</span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Guardado</span>
            <span class="font-medium text-green-600 dark:text-green-400">{{ formatCurrency(form.saved) }}</span>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Falta</span>
            <span class="font-medium text-amber-600 dark:text-amber-400">
              {{ formatCurrency(form.goal - form.saved) }}
            </span>
          </div>

          <!-- Progress bar -->
          <div class="mt-2">
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progresso</span>
              <span>{{ progressPercent }}%</span>
            </div>
            <CustomProgressBar :value="form.saved" :max="form.goal" />
          </div>
        </div>
        <div v-else class="text-center py-8">
          <UIcon name="i-heroicons-chart-pie" class="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Preencha a meta para ver o resumo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { addPiggyBank, updatePiggyBank, getPiggyBank } = useCofrinhos()

const isEditing = ref(false)
const piggyBankId = ref(null)

const form = reactive({
  name: '',
  goal: 0,
  saved: 0,
  category: '',
})

onMounted(() => {
  piggyBankId.value = route.query.id
  if (piggyBankId.value) {
    const piggyBank = getPiggyBank(piggyBankId.value)
    if (piggyBank) {
      isEditing.value = true
      form.name = piggyBank.name
      form.goal = piggyBank.goal
      form.saved = piggyBank.saved
      form.category = piggyBank.category
    } else {
      toast.add({ title: 'Cofrinho não encontrado', color: 'error' })
      router.push('/cofrinhos')
    }
  }
})

const categoryOptions = [
  'Viagem',
  'Educação',
  'Carro',
  'Casa',
  'Emergência',
  'Outros',
]

const progressPercent = computed(() => {
  if (!form.goal) return 0
  return Math.round((form.saved / form.goal) * 100)
})

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
}

function handleSave() {
  if (!form.name || !form.goal) {
    toast.add({
      title: 'Campos obrigatórios',
      description: 'Preencha o nome e a meta de valor.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'warning',
    })
    return
  }

  const data = {
    name: form.name,
    goal: form.goal,
    saved: form.saved,
    category: form.category || 'Outros',
  }

  if (isEditing.value) {
    updatePiggyBank(piggyBankId.value, data)
    toast.add({
      title: 'Cofrinho atualizado!',
      description: `"${form.name}" foi atualizado com sucesso.`,
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
  } else {
    addPiggyBank(data)
    toast.add({
      title: 'Cofrinho criado!',
      description: `"${form.name}" foi salvo com sucesso.`,
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
  }

  router.push('/cofrinhos')
}

useHead({
  title: computed(() => isEditing.value ? 'Editar Cofrinho' : 'Novo Cofrinho'),
})
</script>
