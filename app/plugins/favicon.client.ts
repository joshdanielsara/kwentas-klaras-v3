import { useFavicon } from '~/composables/ui/useFavicon'

export default defineNuxtPlugin(() => {
  const { setDefaultFavicons } = useFavicon()
  setDefaultFavicons()
})

