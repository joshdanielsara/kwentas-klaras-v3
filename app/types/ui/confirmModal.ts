export interface ProjectDetails {
  name?: string
  appropriation?: number
}

export interface UserDetails {
  name?: string
  role?: string
  email?: string
}

export interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  loadingText?: string
  autoCloseSeconds?: number
  countDownMessage?: string
  projectDetails?: ProjectDetails
  userDetails?: UserDetails
}

