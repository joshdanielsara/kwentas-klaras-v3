export interface Department {
  id: string
  name: string
}

export const useDepartments = () => {
  const departments = ref<Department[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDepartments = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; departments: Department[] }>('/api/departments')
      if (response.success) {
        departments.value = response.departments
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch departments'
    } finally {
      loading.value = false
    }
  }

  return {
    departments,
    loading,
    error,
    fetchDepartments,
  }
}
