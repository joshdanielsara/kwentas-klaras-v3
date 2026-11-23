import { PrismaClient } from '@prisma/client'
import {
  ADMIN_PERMISSION_KEYS,
  DEFAULT_PERMISSION_CATALOG,
  STAFF_PERMISSION_KEYS,
  SYSTEM_ROLE_SLUGS,
} from '../app/constants/rbac/permissionCatalog'

const prisma = new PrismaClient()

async function upsertPermissions() {
  const permissionIdsByKey = new Map<string, string>()

  for (const item of DEFAULT_PERMISSION_CATALOG) {
    const existing = await prisma.permission.findUnique({ where: { key: item.key } })
    if (existing) {
      const updated = await prisma.permission.update({
        where: { key: item.key },
        data: {
          action: item.action,
          subject: item.subject,
          label: item.label,
          description: item.description,
          isSystem: item.isSystem,
        },
      })
      permissionIdsByKey.set(updated.key, updated.id)
      continue
    }

    const created = await prisma.permission.create({
      data: {
        key: item.key,
        action: item.action,
        subject: item.subject,
        label: item.label,
        description: item.description,
        isSystem: item.isSystem,
      },
    })
    permissionIdsByKey.set(created.key, created.id)
  }

  return permissionIdsByKey
}

async function upsertRole(slug: string, name: string, description: string) {
  const existing = await prisma.role.findUnique({ where: { slug } })
  if (existing) {
    return prisma.role.update({
      where: { slug },
      data: { name, description, isSystem: true },
    })
  }

  return prisma.role.create({
    data: {
      slug,
      name,
      description,
      isSystem: true,
    },
  })
}

async function syncRolePermissions(roleId: string, permissionKeys: readonly string[], permissionIdsByKey: Map<string, string>) {
  const existingLinks = await prisma.rolePermission.findMany({ where: { roleId } })
  const existingPermissionIds = new Set(existingLinks.map((link) => link.permissionId))

  for (const key of permissionKeys) {
    const permissionId = permissionIdsByKey.get(key)
    if (!permissionId || existingPermissionIds.has(permissionId)) {
      continue
    }

    await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    })
  }
}

async function main() {
  const permissionIdsByKey = await upsertPermissions()

  const adminRole = await upsertRole(
    SYSTEM_ROLE_SLUGS.ADMIN,
    'Admin',
    'Full municipal administrator access'
  )
  const staffRole = await upsertRole(
    SYSTEM_ROLE_SLUGS.STAFFS,
    'Staff',
    'Limited municipal staff access'
  )

  await syncRolePermissions(adminRole.id, ADMIN_PERMISSION_KEYS, permissionIdsByKey)
  await syncRolePermissions(staffRole.id, STAFF_PERMISSION_KEYS, permissionIdsByKey)

  console.log('[seedRolesPermissions] roles and permissions seeded')
}

main()
  .catch((error) => {
    console.error('[seedRolesPermissions] seed failed', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
