import { abilitiesPlugin } from '@casl/vue'
import { createAbility } from '~/abilities'

export default defineNuxtPlugin((nuxtApp) => {
  const initialAbility = createAbility(null)
  
  nuxtApp.vueApp.use(abilitiesPlugin, initialAbility, {
    useGlobalProperties: true,
  })
})

