<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div class="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-4">
      <div
        v-for="n in columns"
        :key="`h-${n}`"
        class="h-3 bg-gray-200 rounded"
        :class="n === columns ? 'w-16 ml-auto' : 'w-24'"
      ></div>
    </div>
    <div
      v-for="row in rows"
      :key="`r-${row}`"
      class="px-4 py-3 border-b border-gray-100 last:border-b-0 flex items-center gap-4"
    >
      <div
        v-for="col in columns"
        :key="`c-${row}-${col}`"
        class="h-4 bg-gray-200 rounded"
        :class="col === columns ? 'w-14 ml-auto' : col === 1 ? 'w-40' : 'w-24'"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
  columns?: number
}>(), {
  rows: 6,
  columns: 4,
})
</script>
