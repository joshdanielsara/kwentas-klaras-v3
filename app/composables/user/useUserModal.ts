import type { User } from '~/types/user/user'
import { useModal } from '../ui/useModal'

export const useUserModal = (saveError?: Ref<string | null>) => {
  const editingUser = ref<User | null>(null)

  const { isOpen: isModalOpen, open, close: closeModal } = useModal(() => {
    editingUser.value = null
    if (saveError) {
      saveError.value = null
    }
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

  return {
    isModalOpen,
    editingUser,
    openAddModal,
    openEditModal,
    closeModal,
  }
}

