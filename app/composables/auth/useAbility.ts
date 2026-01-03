import { useAbility as useCaslAbility } from '@casl/vue'
import type { Actions, Subjects } from '~/abilities'

export function useAppAbility() {
  const { can: caslCan, cannot: caslCannot } = useCaslAbility()

  const can = (action: Actions, subject: Subjects): boolean => {
    return caslCan(action, subject)
  }

  const cannot = (action: Actions, subject: Subjects): boolean => {
    return caslCannot(action, subject)
  }

  return {
    can,
    cannot,
  }
}

