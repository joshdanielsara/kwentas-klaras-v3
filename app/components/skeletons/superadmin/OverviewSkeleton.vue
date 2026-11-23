<template>
  <div class="space-y-6 animate-pulse">
    <div>
      <div class="h-8 bg-gray-200 rounded w-64 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-80"></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="n in count"
        :key="n"
        class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
      >
        <div class="h-4 bg-gray-200 rounded w-28"></div>
        <div class="h-9 bg-gray-200 rounded w-16 mt-3"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 6,
})
</script>
