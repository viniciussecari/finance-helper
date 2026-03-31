<template>
  <!-- Desktop Sidebar -->
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <aside
      class="hidden md:flex fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col z-30"
    >
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <img class="h-10" src="~/assets/images/logo.png" alt="Finance Helper Logo" />
        <span class="text-lg font-bold text-gray-900 dark:text-white">Finance Helper</span>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="[
            isActive(item.path)
              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
          ]"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3 px-3 py-2">
          <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <UIcon name="i-heroicons-user" class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">Usuário</p>
            <p class="text-xs text-gray-500 truncate">usuario@email.com</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="md:ml-64 min-h-screen pb-24 md:pb-0">
      <header class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 md:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
          <div class="flex items-center gap-3">
            <UButton variant="ghost" icon="i-heroicons-bell" color="neutral" />
            <UButton variant="ghost" icon="i-heroicons-cog-6-tooth" color="neutral" />
          </div>
        </div>
      </header>

      <div class="px-4 py-6 md:px-8">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav
      class="md:hidden fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 z-30"
    >
      <div class="flex items-center justify-around px-2 py-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-0"
          :class="[
            isActive(item.path)
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
          ]"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          <span class="text-[10px] font-medium truncate">{{ item.mobileLabel || item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
const route = useRoute()

const menuItems = [
  { path: '/', label: 'Dashboard', mobileLabel: 'Home', icon: 'i-heroicons-home' },
  { path: '/gastos-fixos', label: 'Gastos Fixos', mobileLabel: 'Gastos', icon: 'i-heroicons-banknotes' },
]

const pageTitles = {
  '/': 'Dashboard',
  '/gastos-fixos': 'Gastos Fixos',
  '/gastos-fixos/novo': 'Novo Gasto',
}

const pageTitle = computed(() => {
  return pageTitles[route.path] || 'Finance Helper'
})

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
