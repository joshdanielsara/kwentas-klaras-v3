export interface Remark {
  id: string
  name: string
}

export const useRemarks = () => {
  const remarks = ref<Remark[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRemarks = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; remarks: Remark[] }>('/api/remarks')
      if (response.success) {
        remarks.value = response.remarks
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch remarks'
    } finally {
      loading.value = false
    }
  }

  return {
    remarks,
    loading,
    error,
    fetchRemarks,
  }
}
