import type { User } from '~/types/user/user'

export const useUserSearch = (users: Readonly<Ref<readonly User[]>>, searchQuery: Ref<string>) => {
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

  return {
    filteredUsers,
  }
}

