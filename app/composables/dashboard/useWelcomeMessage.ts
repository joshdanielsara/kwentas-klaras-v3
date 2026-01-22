import { useAuthStore } from '~/stores/authStore'
import { PAGE_HEADERS } from '~/constants/pages/headers'

export const useWelcomeMessage = () => {
  const { user } = useAuthStore()

  const welcomeMessage = computed(() => {
    if (!user.value) {
      return PAGE_HEADERS.dashboard.title
    }
    
    const firstName = user.value.firstName || ''
    const lastName = user.value.lastName || ''
    const department = user.value.department
    
    const namePart = [firstName, lastName].filter(Boolean).join(' ') || 'Admin'
    const departmentPart = department ? ` and ${department}` : ''
    
    return `Welcome Back ${namePart}${departmentPart}`
  })

  return {
    welcomeMessage,
  }
}
