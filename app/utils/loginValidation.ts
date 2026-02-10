import type { LoginForm } from '~/types/auth/login'

export const validateLoginForm = (form: LoginForm): string | null => {
  if (!form.email.trim()) {
    return 'Email is required'
  }

  if (!form.password.trim()) {
    return 'Password is required'
  }

  // Email validation: requires at least 2 characters for TLD
  // Accepts: example.co, example.com, example.com.ph
  // Rejects: example.c (single character TLD)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}(\.[^\s@]{2,})*$/
  if (!emailRegex.test(form.email)) {
    return 'Please enter a valid email address'
  }

  return null
}
