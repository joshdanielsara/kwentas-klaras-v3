import { TAB_IDS, type ProjectDetailTabId } from './detailTabs'

export interface TabPermissionRef {
  action: string
  subject: string
}

export interface ProjectDetailTabPermissionConfig {
  read: TabPermissionRef
  create?: TabPermissionRef
  update?: TabPermissionRef
  delete?: TabPermissionRef
  export?: TabPermissionRef
}

export const PROJECT_DETAIL_TAB_PERMISSIONS: Record<ProjectDetailTabId, ProjectDetailTabPermissionConfig> = {
  [TAB_IDS.SUMMARY]: {
    read: { action: 'read', subject: 'ProjectSummary' },
  },
  [TAB_IDS.TIMELINE]: {
    read: { action: 'read', subject: 'ProjectTimeline' },
  },
  [TAB_IDS.DETAILS]: {
    read: { action: 'read', subject: 'ProjectDetails' },
  },
  [TAB_IDS.BUDGET]: {
    read: { action: 'read', subject: 'Budget' },
    create: { action: 'create', subject: 'Budget' },
  },
  [TAB_IDS.OBLIGATIONS]: {
    read: { action: 'read', subject: 'Obligation' },
    create: { action: 'create', subject: 'Obligation' },
  },
  [TAB_IDS.DISBURSEMENTS]: {
    read: { action: 'read', subject: 'Disbursement' },
    create: { action: 'create', subject: 'Disbursement' },
  },
  [TAB_IDS.LOGS]: {
    read: { action: 'read', subject: 'ProjectLog' },
    export: { action: 'export', subject: 'ProjectLog' },
  },
  [TAB_IDS.DOCUMENTS]: {
    read: { action: 'read', subject: 'Document' },
    create: { action: 'create', subject: 'Document' },
  },
  [TAB_IDS.MAP]: {
    read: { action: 'read', subject: 'ProjectMap' },
    update: { action: 'update', subject: 'ProjectMap' },
    delete: { action: 'delete', subject: 'ProjectMap' },
  },
}
