<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <SuperadminSidebar />
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Roles</h1>
              <p class="text-sm text-gray-500">Create and manage access roles</p>
            </div>
            <button
              class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
              @click="showCreate = !showCreate"
            >
              {{ showCreate ? 'Cancel' : 'Add Role' }}
            </button>
          </div>

          <div v-if="showCreate" class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input v-model="form.slug" placeholder="slug (e.g. auditor)" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input v-model="form.name" placeholder="Display name" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              <input v-model="form.description" placeholder="Description" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
            <button
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              :disabled="saving"
              @click="handleCreate"
            >
              {{ saving ? 'Saving...' : 'Create Role' }}
            </button>
          </div>

          <div v-if="loading" class="text-sm text-gray-500">Loading roles...</div>
          <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Users</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Permissions</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-50/80">
                  <td class="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {{ role.name }}
                    <span v-if="role.isSystem" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-brand-green">system</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{{ role.slug }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ role.userCount }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ role.permissionIds.length }}</td>
                  <td class="px-4 py-3 text-sm text-right whitespace-nowrap space-x-3">
                    <NuxtLink :to="`/superadmin/roles/${role.id}`" class="text-brand-blue font-medium hover:underline">Edit</NuxtLink>
                    <button
                      v-if="!role.isSystem"
                      class="text-red-600 font-medium hover:underline"
                      @click="handleDelete(role.id)"
                    >
                      Delete
                    </button>
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
import { useRoles } from '~/composables/superadmin/useRoles'

definePageMeta({
  layout: false,
  middleware: 'superadmin',
})

const { roles, loading, fetchRoles, createRole, deleteRole } = useRoles()
const showCreate = ref(false)
const saving = ref(false)
const formError = ref('')
const form = reactive({
  slug: '',
  name: '',
  description: '',
})

onMounted(async () => {
  await fetchRoles()
})

const handleCreate = async () => {
  saving.value = true
  formError.value = ''
  try {
    await createRole({
      slug: form.slug,
      name: form.name,
      description: form.description,
    })
    form.slug = ''
    form.name = ''
    form.description = ''
    showCreate.value = false
    await fetchRoles()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    formError.value = err.data?.message || err.message || 'Failed to create role'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Delete this role?')) {
    return
  }
  try {
    await deleteRole(id)
    await fetchRoles()
  } catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    alert(err.data?.message || err.message || 'Failed to delete role')
  }
}
</script>
