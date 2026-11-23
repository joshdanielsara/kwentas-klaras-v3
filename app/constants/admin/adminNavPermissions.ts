export interface AdminNavPermissionRef {
  action: string
  subject: string
}

export interface AdminNavPermissionRule {
  path: string
  exact?: boolean
  permission: AdminNavPermissionRef
}

/** Sidebar + route guards for municipal admin navigation. */
export const ADMIN_NAV_PERMISSION_RULES: AdminNavPermissionRule[] = [
  {
    path: '/admin',
    exact: true,
    permission: { action: 'read', subject: 'Dashboard' },
  },
  {
    path: '/admin/activities',
    permission: { action: 'read', subject: 'Dashboard' },
  },
  {
    path: '/admin/projects',
    permission: { action: 'read', subject: 'Project' },
  },
  {
    path: '/admin/reports',
    permission: { action: 'read', subject: 'Report' },
  },
  {
    path: '/admin/graphs',
    permission: { action: 'read', subject: 'Graph' },
  },
  {
    path: '/admin/check-payment',
    permission: { action: 'read', subject: 'CheckPayment' },
  },
  {
    path: '/admin/users',
    permission: { action: 'read', subject: 'User' },
  },
  {
    path: '/admin/settings',
    permission: { action: 'read', subject: 'Settings' },
  },
]

export const resolveAdminNavPermission = (routePath: string): AdminNavPermissionRef | null => {
  const normalized = routePath.replace(/\/+$/, '') || '/admin'

  const exactMatch = ADMIN_NAV_PERMISSION_RULES.find((rule) => {
    if (!rule.exact) {
      return false
    }
    const rulePath = rule.path.replace(/\/+$/, '') || '/admin'
    return normalized === rulePath
  })

  if (exactMatch) {
    return exactMatch.permission
  }

  const prefixMatches = ADMIN_NAV_PERMISSION_RULES
    .filter((rule) => !rule.exact)
    .filter((rule) => normalized === rule.path || normalized.startsWith(`${rule.path}/`))
    .sort((a, b) => b.path.length - a.path.length)

  return prefixMatches[0]?.permission ?? null
}
