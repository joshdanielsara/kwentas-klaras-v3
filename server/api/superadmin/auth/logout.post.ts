import { clearSuperadminSessionCookie } from '../../../utils/superadminSession'

export default defineEventHandler(async (event) => {
  clearSuperadminSessionCookie(event)
  return { success: true }
})
