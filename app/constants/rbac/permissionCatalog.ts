export interface PermissionSeedItem {
  key: string
  action: string
  subject: string
  label: string
  description: string
  isSystem: boolean
}

export const SYSTEM_ROLE_SLUGS = {
  ADMIN: 'admin',
  STAFFS: 'staffs',
} as const

export const PERMISSION_KEY_SEPARATOR = ':'

export const buildPermissionKey = (action: string, subject: string): string => {
  return `${action.trim().toLowerCase()}${PERMISSION_KEY_SEPARATOR}${subject.trim()}`
}

export const DEFAULT_PERMISSION_CATALOG: PermissionSeedItem[] = [
  {
    key: 'manage:all',
    action: 'manage',
    subject: 'all',
    label: 'Manage All',
    description: 'Full access to every subject',
    isSystem: true,
  },
  {
    key: 'read:Dashboard',
    action: 'read',
    subject: 'Dashboard',
    label: 'Read Dashboard',
    description: 'View the dashboard',
    isSystem: true,
  },
  {
    key: 'read:Project',
    action: 'read',
    subject: 'Project',
    label: 'Read Projects',
    description: 'View projects',
    isSystem: true,
  },
  {
    key: 'create:Project',
    action: 'create',
    subject: 'Project',
    label: 'Create Projects',
    description: 'Create projects and related records',
    isSystem: true,
  },
  {
    key: 'update:Project',
    action: 'update',
    subject: 'Project',
    label: 'Update Projects',
    description: 'Edit projects and related records',
    isSystem: true,
  },
  {
    key: 'delete:Project',
    action: 'delete',
    subject: 'Project',
    label: 'Delete Projects',
    description: 'Soft-delete and restore projects',
    isSystem: true,
  },
  {
    key: 'read:Report',
    action: 'read',
    subject: 'Report',
    label: 'View Reports',
    description: 'Access the Reports navigation page',
    isSystem: true,
  },
  {
    key: 'read:Graph',
    action: 'read',
    subject: 'Graph',
    label: 'View Graphs',
    description: 'Access the Graphs navigation page',
    isSystem: true,
  },
  {
    key: 'read:CheckPayment',
    action: 'read',
    subject: 'CheckPayment',
    label: 'View Check Payment',
    description: 'Access the Check Payment navigation page',
    isSystem: true,
  },
  {
    key: 'read:Settings',
    action: 'read',
    subject: 'Settings',
    label: 'View Settings',
    description: 'Access the Settings navigation page',
    isSystem: true,
  },
  {
    key: 'read:ProjectSummary',
    action: 'read',
    subject: 'ProjectSummary',
    label: 'View Project Summary Tab',
    description: 'View the Project Summary tab on project details',
    isSystem: true,
  },
  {
    key: 'read:ProjectTimeline',
    action: 'read',
    subject: 'ProjectTimeline',
    label: 'View Timeline Tab',
    description: 'View the Timeline tab on project details',
    isSystem: true,
  },
  {
    key: 'read:ProjectDetails',
    action: 'read',
    subject: 'ProjectDetails',
    label: 'View Details Tab',
    description: 'View the Details tab on project details',
    isSystem: true,
  },
  {
    key: 'read:Budget',
    action: 'read',
    subject: 'Budget',
    label: 'View Budget Tab',
    description: 'View the Budget tab on project details',
    isSystem: true,
  },
  {
    key: 'create:Budget',
    action: 'create',
    subject: 'Budget',
    label: 'Add Additional Budget',
    description: 'Add additional budget records on a project',
    isSystem: true,
  },
  {
    key: 'read:Obligation',
    action: 'read',
    subject: 'Obligation',
    label: 'View Obligations Tab',
    description: 'View the Obligations tab on project details',
    isSystem: true,
  },
  {
    key: 'create:Obligation',
    action: 'create',
    subject: 'Obligation',
    label: 'Add Obligation',
    description: 'Add obligation records on a project',
    isSystem: true,
  },
  {
    key: 'read:Disbursement',
    action: 'read',
    subject: 'Disbursement',
    label: 'View Disbursements Tab',
    description: 'View the Disbursements tab on project details',
    isSystem: true,
  },
  {
    key: 'create:Disbursement',
    action: 'create',
    subject: 'Disbursement',
    label: 'Add Disbursement',
    description: 'Add disbursement records on a project',
    isSystem: true,
  },
  {
    key: 'read:ProjectLog',
    action: 'read',
    subject: 'ProjectLog',
    label: 'View Logs Tab',
    description: 'View the Activity Log tab on project details',
    isSystem: true,
  },
  {
    key: 'export:ProjectLog',
    action: 'export',
    subject: 'ProjectLog',
    label: 'Export Project Logs',
    description: 'Export project activity logs to Excel',
    isSystem: true,
  },
  {
    key: 'read:Document',
    action: 'read',
    subject: 'Document',
    label: 'View Documents Tab',
    description: 'View the Documents tab on project details',
    isSystem: true,
  },
  {
    key: 'create:Document',
    action: 'create',
    subject: 'Document',
    label: 'Add Document',
    description: 'Upload or add project documents',
    isSystem: true,
  },
  {
    key: 'read:ProjectMap',
    action: 'read',
    subject: 'ProjectMap',
    label: 'View Project Map Tab',
    description: 'View the Project Map tab on project details',
    isSystem: true,
  },
  {
    key: 'update:ProjectMap',
    action: 'update',
    subject: 'ProjectMap',
    label: 'Save Project Map Location',
    description: 'Save or update project geotag coordinates',
    isSystem: true,
  },
  {
    key: 'delete:ProjectMap',
    action: 'delete',
    subject: 'ProjectMap',
    label: 'Clear Project Map Location',
    description: 'Clear project geotag coordinates',
    isSystem: true,
  },
  {
    key: 'read:User',
    action: 'read',
    subject: 'User',
    label: 'Read Users',
    description: 'View user accounts',
    isSystem: true,
  },
  {
    key: 'create:User',
    action: 'create',
    subject: 'User',
    label: 'Create Users',
    description: 'Create user accounts',
    isSystem: true,
  },
  {
    key: 'update:User',
    action: 'update',
    subject: 'User',
    label: 'Update Users',
    description: 'Edit user accounts',
    isSystem: true,
  },
  {
    key: 'delete:User',
    action: 'delete',
    subject: 'User',
    label: 'Delete Users',
    description: 'Soft-delete and restore users',
    isSystem: true,
  },
  {
    key: 'read:Profile',
    action: 'read',
    subject: 'Profile',
    label: 'Read Profile',
    description: 'View own profile',
    isSystem: true,
  },
  {
    key: 'update:Profile',
    action: 'update',
    subject: 'Profile',
    label: 'Update Profile',
    description: 'Edit own profile',
    isSystem: true,
  },
]

export const ADMIN_NAV_READ_PERMISSION_KEYS = [
  'read:Dashboard',
  'read:Project',
  'read:Report',
  'read:Graph',
  'read:CheckPayment',
  'read:Settings',
] as const

export const PROJECT_DETAIL_READ_PERMISSION_KEYS = [
  'read:ProjectSummary',
  'read:ProjectTimeline',
  'read:ProjectDetails',
  'read:Budget',
  'read:Obligation',
  'read:Disbursement',
  'read:ProjectLog',
  'read:Document',
  'read:ProjectMap',
] as const

export const STAFF_PERMISSION_KEYS = [
  ...ADMIN_NAV_READ_PERMISSION_KEYS,
  ...PROJECT_DETAIL_READ_PERMISSION_KEYS,
  'read:Profile',
  'update:Profile',
] as const

export const ADMIN_PERMISSION_KEYS = DEFAULT_PERMISSION_CATALOG.map((item) => item.key)
