<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ config.title }}</h1>
        <p class="text-sm text-gray-500">{{ config.description }}</p>
      </div>
      <button
        class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        @click="showCreate = !showCreate"
      >
        {{ showCreate ? 'Cancel' : config.addLabel }}
      </button>
    </div>

    <div v-if="showCreate" class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
      <input
        v-model="createName"
        :placeholder="config.namePlaceholder"
        class="w-full md:w-96 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
      />
      <p v-if="formError && !editingId" class="text-sm text-red-600">{{ formError }}</p>
      <button
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        :disabled="saving || !createName.trim()"
        @click="handleCreate"
      >
        {{ saving && !editingId ? 'Saving...' : config.addLabel }}
      </button>
    </div>

    <SuperadminTableListSkeleton v-if="loading" :columns="2" :rows="8" />
    <div v-else-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</div>
    <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50/80">
            <td class="px-4 py-3 text-sm text-gray-900">
              <input
                v-if="editingId === item.id"
                v-model="editName"
                class="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <span v-else class="font-medium">{{ item.name }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-right whitespace-nowrap space-x-3">
              <template v-if="editingId === item.id">
                <button
                  class="text-brand-blue font-medium hover:underline disabled:opacity-50"
                  :disabled="saving || !editName.trim()"
                  @click="handleUpdate"
                >
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button class="text-gray-500 font-medium hover:underline" @click="cancelEdit">
                  Cancel
                </button>
              </template>
              <template v-else>
                <button class="text-brand-blue font-medium hover:underline" @click="startEdit(item)">
                  Edit
                </button>
                <button class="text-red-600 font-medium hover:underline" @click="handleDelete(item.id)">
                  Delete
                </button>
              </template>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="2" class="px-4 py-8 text-center text-sm text-gray-500">
              No {{ config.title.toLowerCase() }} yet. Add one to get started.
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="formError && editingId" class="px-4 py-3 text-sm text-red-600 border-t border-gray-100">
        {{ formError }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SuperadminCatalogResourceConfig } from '~/constants/superadmin/catalogResources'
import SuperadminTableListSkeleton from '~/components/skeletons/superadmin/TableListSkeleton.vue'
import { useNamedCatalogPage } from '~/composables/superadmin/useNamedCatalogPage'

const props = defineProps<{
  config: SuperadminCatalogResourceConfig
}>()

const {
  items,
  loading,
  errorMessage,
  showCreate,
  saving,
  formError,
  createName,
  editingId,
  editName,
  fetchItems,
  startEdit,
  cancelEdit,
  handleCreate,
  handleUpdate,
  handleDelete,
} = useNamedCatalogPage(props.config)

onMounted(async () => {
  await fetchItems()
})
</script>
