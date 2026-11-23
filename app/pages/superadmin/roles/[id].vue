<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <SuperadminSidebar />
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div v-if="loading" class="text-sm text-gray-500">Loading role...</div>
        <div v-else-if="role" class="space-y-6 max-w-5xl">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ role.name }}</h1>
              <p class="text-sm text-gray-500">Slug: {{ role.slug }}</p>
            </div>
            <NuxtLink to="/superadmin/roles" class="text-sm text-brand-blue hover:underline">Back to roles</NuxtLink>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="form.name" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Name" />
              <input v-model="form.description" class="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Description" />
            </div>

            <div>
              <h2 class="text-sm font-semibold text-gray-900 mb-3">Permissions</h2>
              <div class="space-y-4">
                <div v-for="group in groupedPermissions" :key="group.subject" class="border border-gray-100 rounded-lg p-3">
                  <p class="text-xs font-semibold uppercase text-gray-500 mb-2">{{ group.subject }}</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <label
                      v-for="permission in group.items"
                      :key="permission.id"
                      class="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        :value="permission.id"
                        v-model="selectedPermissionIds"
                        class="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                      />
                      <span>{{ permission.label }} <span class="text-gray-400">({{ permission.key }})</span></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
            <button
              class="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg disabled:opacity-50"
              :disabled="saving"
              @click="handleSave"
            >
              {{ saving ? 'Saving...' : 'Save Role' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SuperadminSidebar from '~/components/superadmin/Sidebar.vue'
import { useRoles } from '~/composables/superadmin/useRoles'
import { usePermissions } from '~/composables/superadmin/usePermissions'
import type { RoleItem } from '~/types/rbac/role'

definePageMeta({
  layout: false,
  middleware: 'superadmin',
})

const route = useRoute()
const { fetchRole, updateRole } = useRoles()
const { permissions, fetchPermissions } = usePermissions()

const loading = ref(true)
const saving = ref(false)
const formError = ref('')
const role = ref<RoleItem | null>(null)
const form = reactive({
  name: '',
  description: '',
})
const selectedPermissionIds = ref<string[]>([])

const groupedPermissions = computed(() => {
  const groups = new Map<string, typeof permissions.value>()
  for (const permission of permissions.value) {
    const current = groups.get(permission.subject) || []
    current.push(permission)
    groups.set(permission.subject, current)
  }
  return [...groups.entries()].map(([subject, items]) => ({ subject, items }))
})

onMounted(async () => {
  try {
    const id = String(route.params.id)
    await fetchPermissions()
    role.value = await fetchRole(id)
    form.name = role.value.name
    form.description = role.value.description || ''
    selectedPermissionIds.value = [...role.value.permissionIds]
  } catch (error) {
    console.error('[superadmin/roles/id] load failed', {
      error: error instanceof Error ? error.message : 'unknown',
    })
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  if (!role.value) {
    return
  }
  saving.value = true
  formError.value = ''
  try {
    role.value = await updateRole(role.value.id, {
      name: form.name,
      description: form.description,
      permissionIds: selectedPermissionIds.value,
    })
  } catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    formError.value = err.data?.message || err.message || 'Failed to save role'
  } finally {
    saving.value = false
  }
}
</script>
