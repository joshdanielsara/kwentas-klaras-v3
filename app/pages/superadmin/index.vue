<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <SuperadminSidebar />
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Superadmin Overview</h1>
            <p class="text-sm text-gray-500">Manage roles, permissions, and project reference catalogs</p>
          </div>

          <SuperadminOverviewSkeleton v-if="loading" />
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Roles</p>
              <p class="text-3xl font-bold text-brand-blue mt-2">{{ summary.roleCount }}</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Permissions</p>
              <p class="text-3xl font-bold text-brand-blue mt-2">{{ summary.permissionCount }}</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Barangays</p>
              <p class="text-3xl font-bold text-brand-blue mt-2">{{ summary.barangayCount }}</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Services</p>
              <p class="text-3xl font-bold text-brand-blue mt-2">{{ summary.serviceCount }}</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Implementing Units</p>
              <p class="text-3xl font-bold text-brand-blue mt-2">{{ summary.implementingUnitCount }}</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p class="text-sm text-gray-500">Custom Permissions</p>
              <p class="text-3xl font-bold text-brand-blue mt-2">{{ summary.customPermissionCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SuperadminSidebar from '~/components/superadmin/Sidebar.vue'
import SuperadminOverviewSkeleton from '~/components/skeletons/superadmin/OverviewSkeleton.vue'

definePageMeta({
  layout: false,
  middleware: 'superadmin',
})

const loading = ref(true)
const summary = ref({
  roleCount: 0,
  systemRoleCount: 0,
  permissionCount: 0,
  customPermissionCount: 0,
  barangayCount: 0,
  serviceCount: 0,
  implementingUnitCount: 0,
})

onMounted(async () => {
  try {
    const response = await $fetch<{
      success: boolean
      summary: {
        roleCount: number
        systemRoleCount: number
        permissionCount: number
        customPermissionCount: number
        barangayCount: number
        serviceCount: number
        implementingUnitCount: number
      }
    }>('/api/superadmin/summary')
    summary.value = response.summary
  } catch (error) {
    console.error('[superadmin/index] failed to load summary', {
      error: error instanceof Error ? error.message : 'unknown',
    })
  } finally {
    loading.value = false
  }
})
</script>
