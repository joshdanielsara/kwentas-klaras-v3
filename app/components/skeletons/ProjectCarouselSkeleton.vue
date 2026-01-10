<template>
  <div class="w-full flex-1 flex items-center relative overflow-hidden">
    <div class="lg:flex lg:items-start lg:gap-12 w-full">
      <div class="w-full space-y-8 lg:w-1/2">
        <div class="space-y-4 animate-pulse">
          <div class="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 bg-[length:200%_100%] animate-shimmer"></div>
          <div class="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/2 bg-[length:200%_100%] animate-shimmer"></div>
        </div>

        <div class="flex items-center space-x-3 animate-pulse">
          <div class="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-64 bg-[length:200%_100%] animate-shimmer"></div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-6">
            <div v-for="n in 3" :key="n" class="flex items-center animate-pulse" :style="{ animationDelay: `${n * 0.1}s` }">
              <div class="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full bg-[length:200%_100%] animate-shimmer"></div>
              <div class="ml-4 flex-1 space-y-2">
                <div class="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 bg-[length:200%_100%] animate-shimmer"></div>
                <div class="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 bg-[length:200%_100%] animate-shimmer"></div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="n in 3" :key="n" class="flex items-center animate-pulse" :style="{ animationDelay: `${(n + 3) * 0.1}s` }">
              <div class="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full bg-[length:200%_100%] animate-shimmer"></div>
              <div class="ml-4 flex-1 space-y-2">
                <div class="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 bg-[length:200%_100%] animate-shimmer"></div>
                <div class="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 bg-[length:200%_100%] animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden lg:flex lg:flex-col lg:items-center lg:w-1/2 lg:justify-center mt-8 lg:mt-0">
        <div class="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 mb-6 bg-[length:200%_100%] animate-shimmer animate-pulse"></div>
        <div class="w-[32rem] h-[32rem] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full bg-[length:200%_100%] animate-shimmer animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>

<script setup lang="ts">
</script>
