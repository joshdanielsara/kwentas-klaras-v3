export const usePagination = <T>(items: Ref<T[]> | ComputedRef<T[]> | Ref<readonly T[]> | ComputedRef<readonly T[]>, itemsPerPage: number = 10) => {
  const currentPage = ref(1)
  const isChangingPage = ref(false)

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(items.value.length / itemsPerPage))
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.value.slice(start, end)
  })

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
      isChangingPage.value = true
      currentPage.value = page
      setTimeout(() => {
        isChangingPage.value = false
      }, 300)
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      isChangingPage.value = true
      currentPage.value++
      setTimeout(() => {
        isChangingPage.value = false
      }, 300)
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      isChangingPage.value = true
      currentPage.value--
      setTimeout(() => {
        isChangingPage.value = false
      }, 300)
    }
  }

  const reset = () => {
    currentPage.value = 1
  }

  watch(items, () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  })

  return {
    currentPage: readonly(currentPage),
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPreviousPage,
    itemsPerPage,
    isChangingPage: readonly(isChangingPage),
    goToPage,
    nextPage,
    previousPage,
    reset,
  }
}
