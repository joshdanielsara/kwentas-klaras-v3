import type { User } from '~/types/user/user'
import { useModal } from '../ui/useModal'
import { MODAL_MESSAGES } from '~/constants/ui/modalMessages'
import { asyncHandler } from '~/utils/asyncHandler'

export const useUserModal = (saveError?: Ref<string | null>, handleDeleteUser?: (userId: string) => Promise<void>) => {
  const editingUser = ref<User | null>(null)

  const { isOpen: isModalOpen, open, close: closeModal } = useModal(() => {
    editingUser.value = null
    if (saveError) {
      saveError.value = null
    }
  })

  const showEditConfirmModal = ref(false)
  const showDeleteConfirmModal = ref(false)
  const deleteLoading = ref(false)
  const userToEdit = ref<User | null>(null)
  const userToDelete = ref<User | null>(null)

  const editConfirmMessage = computed(() => {
    if (userToEdit.value) {
      return `Are you sure you want to update "${userToEdit.value.firstName} ${userToEdit.value.lastName}"?`
    }
    return MODAL_MESSAGES.UPDATE_USER.message
  })

  const editUserDetails = computed(() => {
    if (userToEdit.value) {
      return {
        name: `${userToEdit.value.firstName} ${userToEdit.value.lastName}`,
        role: userToEdit.value.role === 'admin' ? 'Admin' : 'Staff',
        email: userToEdit.value.email
      }
    }
    return undefined
  })

  const deleteConfirmMessage = computed(() => {
    if (userToDelete.value) {
      return `Are you sure you want to delete "${userToDelete.value.firstName} ${userToDelete.value.lastName}"? This action cannot be undone.`
    }
    return MODAL_MESSAGES.DELETE_USER.message
  })

  const openAddModal = () => {
    editingUser.value = null
    open()
  }

  const openEditModal = (user: User) => {
    editingUser.value = {
      ...user,
      joined: typeof user.joined === 'string' 
        ? user.joined 
        : user.joined instanceof Date 
          ? user.joined.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : user.joined
    }
    open()
  }

  const handleEditClick = (user: User) => {
    userToEdit.value = user
    showEditConfirmModal.value = true
  }

  const closeEditConfirmModal = () => {
    showEditConfirmModal.value = false
    userToEdit.value = null
  }

  const onConfirmEdit = () => {
    const user = userToEdit.value
    if (user?.id) {
      const userId = user.id
      closeEditConfirmModal()
      navigateTo(`/admin/users/edit/${userId}`)
    }
  }

  const handleDeleteClick = (user: User) => {
    userToDelete.value = user
    showDeleteConfirmModal.value = true
  }

  const closeDeleteConfirmModal = () => {
    showDeleteConfirmModal.value = false
    userToDelete.value = null
  }

  const onConfirmDelete = async () => {
    if (userToDelete.value?.id && handleDeleteUser) {
      deleteLoading.value = true
      const { error } = await asyncHandler(handleDeleteUser(userToDelete.value.id))
      deleteLoading.value = false
      
      if (!error) {
        closeDeleteConfirmModal()
      }
    }
  }

  return {
    isModalOpen,
    editingUser,
    openAddModal,
    openEditModal,
    closeModal,
    showEditConfirmModal,
    showDeleteConfirmModal,
    deleteLoading,
    editConfirmMessage,
    editUserDetails,
    deleteConfirmMessage,
    handleEditClick,
    closeEditConfirmModal,
    onConfirmEdit,
    handleDeleteClick,
    closeDeleteConfirmModal,
    onConfirmDelete,
  }
}

