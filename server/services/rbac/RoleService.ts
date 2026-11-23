import { PermissionRepository } from '../../repositories/rbac/PermissionRepository'
import { RolePermissionRepository } from '../../repositories/rbac/RolePermissionRepository'
import { RoleRepository } from '../../repositories/rbac/RoleRepository'
import { RoleSerializer } from '../../serializers/RoleSerializer'
import { normalizeRoleSlug, validateRoleSlug } from '../../utils/roleSlug'

export class RoleService {
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

  async list() {
    const roles = await this.roleRepository.findAll()
    const formatted = []

    for (const role of roles) {
      const permissionIds = await this.rolePermissionRepository.findPermissionIdsByRoleId(role.id)
      const userCount = await this.roleRepository.countUsersBySlug(role.slug)
      formatted.push(RoleSerializer.formatRole(role, { permissionIds, userCount }))
    }

    return formatted
  }

  async getById(id: string) {
    const role = await this.roleRepository.findById(id)
    if (!role) {
      throw createError({ statusCode: 404, message: 'Role not found' })
    }

    const permissionIds = await this.rolePermissionRepository.findPermissionIdsByRoleId(role.id)
    const permissions = await this.permissionRepository.findAll()
    const assignedPermissions = permissions.filter((permission) => permissionIds.includes(permission.id))
    const userCount = await this.roleRepository.countUsersBySlug(role.slug)

    return RoleSerializer.formatRole(role, {
      permissionIds,
      permissions: assignedPermissions,
      userCount,
    })
  }

  async create(input: { slug: string; name: string; description?: string; permissionIds?: string[] }) {
    const slugError = validateRoleSlug(input.slug)
    if (slugError) {
      throw createError({ statusCode: 400, message: slugError })
    }

    const slug = normalizeRoleSlug(input.slug)
    const name = input.name.trim()
    if (!name) {
      throw createError({ statusCode: 400, message: 'Role name is required' })
    }

    const existing = await this.roleRepository.findBySlug(slug)
    if (existing) {
      throw createError({ statusCode: 409, message: 'Role slug already exists' })
    }

    const role = await this.roleRepository.create({
      slug,
      name,
      description: input.description?.trim() || null,
      isSystem: false,
    })

    if (input.permissionIds?.length) {
      await this.replacePermissions(role.id, input.permissionIds)
    }

    return this.getById(role.id)
  }

  async update(id: string, input: { name?: string; description?: string | null; permissionIds?: string[] }) {
    const role = await this.roleRepository.findById(id)
    if (!role) {
      throw createError({ statusCode: 404, message: 'Role not found' })
    }

    const name = input.name !== undefined ? input.name.trim() : role.name
    if (!name) {
      throw createError({ statusCode: 400, message: 'Role name is required' })
    }

    await this.roleRepository.updateById(id, {
      name,
      description: input.description === undefined ? role.description : (input.description?.trim() || null),
    })

    if (input.permissionIds !== undefined) {
      await this.replacePermissions(id, input.permissionIds)
    }

    return this.getById(id)
  }

  async delete(id: string) {
    const role = await this.roleRepository.findById(id)
    if (!role) {
      throw createError({ statusCode: 404, message: 'Role not found' })
    }

    if (role.isSystem) {
      throw createError({ statusCode: 403, message: 'System roles cannot be deleted' })
    }

    const userCount = await this.roleRepository.countUsersBySlug(role.slug)
    if (userCount > 0) {
      throw createError({
        statusCode: 409,
        message: 'Cannot delete a role that is assigned to users',
      })
    }

    await this.rolePermissionRepository.deleteByRoleId(id)
    await this.roleRepository.deleteById(id)

    return { success: true }
  }

  async getPermissionsForRoleSlug(slug: string) {
    const role = await this.roleRepository.findBySlug(slug)
    if (!role) {
      return []
    }

    const permissionIds = await this.rolePermissionRepository.findPermissionIdsByRoleId(role.id)
    if (permissionIds.length === 0) {
      return []
    }

    const permissions = await this.permissionRepository.findAll()
    return permissions
      .filter((permission) => permissionIds.includes(permission.id))
      .map((permission) => ({
        key: permission.key,
        action: permission.action,
        subject: permission.subject,
      }))
  }

  private async replacePermissions(roleId: string, permissionIds: string[]) {
    const uniqueIds = [...new Set(permissionIds)]
    const permissions = await this.permissionRepository.findAll()
    const validIds = new Set(permissions.map((permission) => permission.id))
    const invalid = uniqueIds.filter((id) => !validIds.has(id))
    if (invalid.length > 0) {
      throw createError({ statusCode: 400, message: 'One or more permission IDs are invalid' })
    }

    await this.rolePermissionRepository.replaceRolePermissions(roleId, uniqueIds)
  }
}
