import type { User } from '~/types/user/user'
import { createAbility, type AppAbility } from '~/abilities'

const user = ref<User | null>(null)
const ability = ref<AppAbility | null>(null)
const loading = ref(false)

export const useAuthStore = () => {
  const isAuthenticated = computed(() => !!user.value && user.value.status === 'Active')
  const userRole = computed(() => user.value?.role)

  const setUser = (userData: User | null) => {
    user.value = userData
    if (userData) {
      ability.value = createAbility(userData)
    } else {
      ability.value = createAbility(null)
    }
  }

  const clearUser = () => {
    user.value = null
    ability.value = createAbility(null)
  }

  return {
    user: readonly(user),
    ability: readonly(ability),
    loading: readonly(loading),
    isAuthenticated,
    userRole,
    setUser,
    clearUser,
  }
}
