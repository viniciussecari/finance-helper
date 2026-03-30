<template>
  <nav class="bg-neutral-primary fixed w-full z-20 top-0  px-6 py-4">
    <div v-if="$route.path !== '/login'" class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
      id="navbar-sticky">
      <ul
        class="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-neutral-primary">
        <li>
          <img class="h-12" src="~/assets/images/logo.png" alt="">
        </li>
        <li v-for="item in menus" class="h-12 flex flex-col justify-center hover:text-white hover:scale-105">
          <NuxtLink :to="item.path">{{ item.label }}</NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
const menus = ref([
  {
    path: '/',
    label: 'Home'
  },
])
</script>

<style></style>
