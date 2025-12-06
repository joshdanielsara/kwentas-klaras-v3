import { useUserStore } from '~/stores/userStore'
import type { User, UserWithPassword } from '~/types/user/user'
import { useErrorHandler } from '../error/useErrorHandler'

export const useUsers = () => {
  const userStore = useUserStore()
  const searchQuery = ref('')
  const isModalOpen = ref(false)
  const editingUser = ref<User | null>(null)
  const saveError = ref<string | null>(null)

  const users = computed(() => userStore.users.value)
  const loading = computed(() => userStore.loading.value)
  const error = computed(() => userStore.error.value)

  const filteredUsers = computed(() => {
    if (!searchQuery.value.trim()) {
      return users.value
    }
    
    const query = searchQuery.value.toLowerCase()
    return users.value.filter((user: User) => 
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    )
  })

  const openAddModal = () => {
    editingUser.value = null
    isModalOpen.value = true
    saveError.value = null
  }

  const openEditModal = (user: User) => {
    editingUser.value = { 
      ...user,
      joined: typeof user.joined === 'string' ? user.joined : user.joined?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    isModalOpen.value = true
    saveError.value = null
  }

  const closeModal = () => {
    isModalOpen.value = false
    editingUser.value = null
    saveError.value = null
  }

  const handleSaveUser = async (userData: UserWithPassword) => {
    saveError.value = null

    await useErrorHandler(async () => {
      if (editingUser.value && editingUser.value.id) {
        await userStore.updateUser(editingUser.value.id, userData)
      } else {
        if (!userData.password) {
          saveError.value = 'Password is required for new users'
          return
        }
        
        const usernameWithoutAt = userData.username.startsWith('@') 
          ? userData.username.slice(1) 
          : userData.username

        await userStore.createUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: usernameWithoutAt,
          email: userData.email,
          password: userData.password,
          department: userData.department,
          status: userData.status || 'Active',
        })
      }
      closeModal()
    }, {
      defaultMessage: 'Failed to save user',
      onError: (err) => {
        saveError.value = err.message
      }
    })
  }

  const fetchUsers = async () => {
    await userStore.fetchUsers()
  }

  const clearSaveError = () => {
    saveError.value = null
  }

  return {
    users,
    filteredUsers: readonly(filteredUsers),
    loading: readonly(loading),
    error: readonly(error),
    searchQuery,
    isModalOpen: readonly(isModalOpen),
    editingUser: readonly(editingUser),
    saveError: readonly(saveError),
    openAddModal,
    openEditModal,
    closeModal,
    handleSaveUser,
    fetchUsers,
    clearSaveError,
  }
}

