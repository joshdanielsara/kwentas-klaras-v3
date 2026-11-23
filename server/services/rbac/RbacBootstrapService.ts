import {
  ADMIN_PERMISSION_KEYS,
  DEFAULT_PERMISSION_CATALOG,
  STAFF_PERMISSION_KEYS,
  SYSTEM_ROLE_SLUGS,
} from '../../../app/constants/rbac/permissionCatalog'
import { PermissionRepository } from '../../repositories/rbac/PermissionRepository'
import { RolePermissionRepository } from '../../repositories/rbac/RolePermissionRepository'
import { RoleRepository } from '../../repositories/rbac/RoleRepository'

export class RbacBootstrapService {
  private roleRepository: RoleRepository
  private permissionRepository: PermissionRepository
  private rolePermissionRepository: RolePermissionRepository

  constructor(
    roleRepository?: RoleRepository,
    permissionRepository?: PermissionRepository,
    rolePermissionRepository?: RolePermissionRepository
  ) {
    this.roleRepository = roleRepository || new RoleRepository()
    this.permissionRepository = permissionRepository || new PermissionRepository()
    this.rolePermissionRepository = rolePermissionRepository || new RolePermissionRepository()
  }

  async ensureDefaults(): Promise<void> {
    const permissionIdsByKey = new Map<string, string>()

    for (const item of DEFAULT_PERMISSION_CATALOG) {
      const existing = await this.permissionRepository.findByKey(item.key)
      if (existing) {
        permissionIdsByKey.set(existing.key, existing.id)
        continue
      }

      const created = await this.permissionRepository.create({
        key: item.key,
        action: item.action,
        subject: item.subject,
        label: item.label,
        description: item.description,
        isSystem: item.isSystem,
      })
      permissionIdsByKey.set(created.key, created.id)
    }

    const adminRole = await this.ensureRole(
      SYSTEM_ROLE_SLUGS.ADMIN,
      'Admin',
      'Full municipal administrator access'
    )
    const staffRole = await this.ensureRole(
      SYSTEM_ROLE_SLUGS.STAFFS,
      'Staff',
      'Limited municipal staff access'
    )

    await this.ensureRolePermissionLinks(adminRole.id, ADMIN_PERMISSION_KEYS, permissionIdsByKey)
    await this.ensureRolePermissionLinks(staffRole.id, STAFF_PERMISSION_KEYS, permissionIdsByKey)
  }

  private async ensureRole(slug: string, name: string, description: string) {
    const existing = await this.roleRepository.findBySlug(slug)
    if (existing) {
      return existing
    }

    return this.roleRepository.create({
      slug,
      name,
      description,
      isSystem: true,
    })
  }

  private async ensureRolePermissionLinks(
    roleId: string,
    keys: readonly string[],
    permissionIdsByKey: Map<string, string>
  ) {
    const existingIds = new Set(await this.rolePermissionRepository.findPermissionIdsByRoleId(roleId))
    const missing = keys
      .map((key) => permissionIdsByKey.get(key))
      .filter((id): id is string => Boolean(id) && !existingIds.has(id))

    if (missing.length === 0) {
      return
    }

    const nextIds = [...existingIds, ...missing]
    await this.rolePermissionRepository.replaceRolePermissions(roleId, nextIds)
  }
}
