import { ref } from 'vue'

export const useModal = (onClose?: () => void) => {
  const isOpen = ref(false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    if (onClose) {
      onClose()
    }
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
    if (!isOpen.value && onClose) {
      onClose()
    }
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

