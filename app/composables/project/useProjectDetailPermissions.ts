import { computed } from 'vue'
import { PROJECT_DETAIL_TABS, type ProjectDetailTabId } from '~/constants/project/detailTabs'
import { PROJECT_DETAIL_TAB_PERMISSIONS } from '~/constants/project/detailTabPermissions'
import { useUserPermissions } from '~/composables/user/useUserPermissions'

export const useProjectDetailPermissions = () => {
  const { can } = useUserPermissions()

  const canAccess = (action: string, subject: string): boolean => {
    return can('manage', 'all') || can(action, subject)
  }

  const canViewTab = (tabId: ProjectDetailTabId): boolean => {
    const config = PROJECT_DETAIL_TAB_PERMISSIONS[tabId]
    return canAccess(config.read.action, config.read.subject)
  }

  const visibleTabs = computed(() => {
    return PROJECT_DETAIL_TABS.filter((tab) => canViewTab(tab.id))
  })

  const canCreateBudget = computed(() => canAccess('create', 'Budget'))
  const canCreateObligation = computed(() => canAccess('create', 'Obligation'))
  const canCreateDisbursement = computed(() => canAccess('create', 'Disbursement'))
  const canCreateDocument = computed(() => canAccess('create', 'Document'))
  const canExportProjectLog = computed(() => canAccess('export', 'ProjectLog'))
  const canUpdateProjectMap = computed(() => canAccess('update', 'ProjectMap'))
  const canClearProjectMap = computed(() => canAccess('delete', 'ProjectMap'))

  return {
    canAccess,
    canViewTab,
    visibleTabs,
    canCreateBudget,
    canCreateObligation,
    canCreateDisbursement,
    canCreateDocument,
    canExportProjectLog,
    canUpdateProjectMap,
    canClearProjectMap,
  }
}
