<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <SuperadminSidebar />
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Permissions</h1>
            <p class="text-sm text-gray-500">System permission catalog used when assigning access to roles</p>
          </div>

          <SuperadminTableListSkeleton v-if="loading" :columns="4" :rows="8" />
          <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Key</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Label</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr v-for="permission in permissions" :key="permission.id" class="hover:bg-gray-50/80">
                  <td class="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">{{ permission.key }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ permission.label }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">
                    <span
                      :class="permission.isSystem
                        ? 'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-brand-green'
                        : 'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-brand-blue'"
                    >
                      {{ permission.isSystem ? 'system' : 'custom' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-right whitespace-nowrap">
                    <button
                      v-if="!permission.isSystem"
                      class="text-red-600 font-medium hover:underline"
                      @click="handleDelete(permission.id)"
                    >
                      Delete
                    </button>
                    <span v-else class="text-gray-400">protected</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SuperadminSidebar from '~/components/superadmin/Sidebar.vue'
import SuperadminTableListSkeleton from '~/components/skeletons/superadmin/TableListSkeleton.vue'
import { usePermissions } from '~/composables/superadmin/usePermissions'

definePageMeta({
  layout: false,
  middleware: 'superadmin',
})

const { permissions, loading, fetchPermissions, deletePermission } = usePermissions()

onMounted(async () => {
  await fetchPermissions()
})

const handleDelete = async (id: string) => {
  if (!confirm('Delete this permission?')) {
    return
  }
  try {
    await deletePermission(id)
    await fetchPermissions()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    alert(err.data?.message || err.message || 'Failed to delete permission')
  }
}
</script>
