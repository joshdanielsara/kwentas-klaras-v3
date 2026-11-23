<template>
  <div class="space-y-6 max-w-5xl animate-pulse">
    <div class="flex items-center justify-between gap-4">
      <div>
        <div class="h-8 bg-gray-200 rounded w-56 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-40"></div>
      </div>
      <div class="h-4 bg-gray-200 rounded w-24"></div>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="h-10 bg-gray-200 rounded-lg"></div>
        <div class="h-10 bg-gray-200 rounded-lg"></div>
      </div>

      <div class="h-4 bg-gray-200 rounded w-28 mb-1"></div>
      <div
        v-for="n in groups"
        :key="n"
        class="border border-gray-100 rounded-lg p-3 space-y-2"
      >
        <div class="h-3 bg-gray-200 rounded w-20"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div class="h-5 bg-gray-200 rounded w-48"></div>
          <div class="h-5 bg-gray-200 rounded w-40"></div>
          <div class="h-5 bg-gray-200 rounded w-44"></div>
          <div class="h-5 bg-gray-200 rounded w-36"></div>
        </div>
      </div>

      <div class="h-9 bg-gray-200 rounded-lg w-28"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  groups?: number
}>(), {
  groups: 4,
})
</script>
