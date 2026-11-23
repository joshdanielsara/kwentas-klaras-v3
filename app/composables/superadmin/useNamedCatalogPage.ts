import type { SuperadminCatalogResourceConfig } from '~/constants/superadmin/catalogResources'
import type { NamedCatalogItem } from '~/types/catalog/namedCatalog'
import { useNamedCatalog } from './useNamedCatalog'

export const useNamedCatalogPage = (config: SuperadminCatalogResourceConfig) => {
  const { items, loading, errorMessage, fetchItems, createItem, updateItem, deleteItem } =
    useNamedCatalog(config)

  const showCreate = ref(false)
  const saving = ref(false)
  const formError = ref('')
  const createName = ref('')
  const editingId = ref<string | null>(null)
  const editName = ref('')

  const startEdit = (item: NamedCatalogItem) => {
    editingId.value = item.id
    editName.value = item.name
    formError.value = ''
  }

  const cancelEdit = () => {
    editingId.value = null
    editName.value = ''
  }

  const handleCreate = async () => {
    saving.value = true
    formError.value = ''
    try {
      await createItem(createName.value)
      createName.value = ''
      showCreate.value = false
      await fetchItems()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      formError.value = err.data?.message || err.message || `Failed to create ${config.title.toLowerCase()}`
    } finally {
      saving.value = false
    }
  }

  const handleUpdate = async () => {
    if (!editingId.value) {
      return
    }
    saving.value = true
    formError.value = ''
    try {
      await updateItem(editingId.value, editName.value)
      cancelEdit()
      await fetchItems()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      formError.value = err.data?.message || err.message || `Failed to update ${config.title.toLowerCase()}`
    } finally {
      saving.value = false
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${config.title.slice(0, -1).toLowerCase()}?`)) {
      return
    }
    try {
      await deleteItem(id)
      if (editingId.value === id) {
        cancelEdit()
      }
      await fetchItems()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      alert(err.data?.message || err.message || `Failed to delete ${config.title.toLowerCase()}`)
    }
  }

  return {
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
  }
}
