import type { NamedCatalogItem } from '~/types/catalog/namedCatalog'
import type { SuperadminCatalogResourceConfig } from '~/constants/superadmin/catalogResources'
import { useSuperadminAuth } from './useSuperadminAuth'

export const useNamedCatalog = (config: SuperadminCatalogResourceConfig) => {
  const { fetchCsrfHeaders } = useSuperadminAuth()
  const items = ref<NamedCatalogItem[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  const fetchItems = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await $fetch<Record<string, unknown>>(config.apiBase)
      const list = response[config.listKey]
      items.value = Array.isArray(list) ? (list as NamedCatalogItem[]) : []
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || `Failed to load ${config.title.toLowerCase()}`
      console.error('[useNamedCatalog] fetch failed', {
        resource: config.resource,
        error: errorMessage.value,
      })
    } finally {
      loading.value = false
    }
  }

  const createItem = async (name: string) => {
    const headers = await fetchCsrfHeaders()
    const response = await $fetch<Record<string, unknown>>(config.apiBase, {
      method: 'POST',
      headers,
      body: { name },
    })
    return response[config.itemKey] as NamedCatalogItem
  }

  const updateItem = async (id: string, name: string) => {
    const headers = await fetchCsrfHeaders()
    const response = await $fetch<Record<string, unknown>>(`${config.apiBase}/${id}`, {
      method: 'PUT',
      headers,
      body: { name },
    })
    return response[config.itemKey] as NamedCatalogItem
  }

  const deleteItem = async (id: string) => {
    const headers = await fetchCsrfHeaders()
    await $fetch(`${config.apiBase}/${id}`, {
      method: 'DELETE',
      headers,
    })
  }

  return {
    items,
    loading,
    errorMessage,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  }
}
