<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <SuperadminSidebar />
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Permissions</h1>
              <p class="text-sm text-gray-500">Catalog of action/subject keys, including custom ones</p>
            </div>
            <button
              class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
              @click="showCreate = !showCreate"
            >
              {{ showCreate ? 'Cancel' : 'Add Permission' }}
            </button>
          </div>

          <div v-if="showCreate" class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input v-model="form.action" placeholder="action (e.g. export)" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input v-model="form.subject" placeholder="subject (e.g. Report)" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input v-model="form.label" placeholder="Label" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input v-model="form.description" placeholder="Description" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <p class="text-xs text-gray-500">Key preview: {{ previewKey }}</p>
            <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
            <button
              class="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg"
              :disabled="saving"
              @click="handleCreate"
            >
              {{ saving ? 'Saving...' : 'Create Permission' }}
            </button>
          </div>

          <div v-if="loading" class="text-sm text-gray-500">Loading permissions...</div>
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
import { usePermissions } from '~/composables/superadmin/usePermissions'
import { buildPermissionKey } from '~/constants/rbac/permissionCatalog'

definePageMeta({
  layout: false,
  middleware: 'superadmin',
})

const { permissions, loading, fetchPermissions, createPermission, deletePermission } = usePermissions()
const showCreate = ref(false)
const saving = ref(false)
const formError = ref('')
const form = reactive({
  action: '',
  subject: '',
  label: '',
  description: '',
})

const previewKey = computed(() => {
  if (!form.action.trim() || !form.subject.trim()) {
    return '—'
  }
  return buildPermissionKey(form.action, form.subject)
})

onMounted(async () => {
  await fetchPermissions()
})

const handleCreate = async () => {
  saving.value = true
  formError.value = ''
  try {
    await createPermission({ ...form })
    form.action = ''
    form.subject = ''
    form.label = ''
    form.description = ''
    showCreate.value = false
    await fetchPermissions()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    formError.value = err.data?.message || err.message || 'Failed to create permission'
  } finally {
    saving.value = false
  }
}

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
