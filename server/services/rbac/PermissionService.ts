import { PermissionRepository } from '../../repositories/rbac/PermissionRepository'
import { RolePermissionRepository } from '../../repositories/rbac/RolePermissionRepository'
import { PermissionSerializer } from '../../serializers/PermissionSerializer'
import {
  normalizePermissionAction,
  normalizePermissionSubject,
  toPermissionKey,
  validatePermissionParts,
} from '../../utils/permissionKey'

export class PermissionService {
  private permissionRepository: PermissionRepository
  private rolePermissionRepository: RolePermissionRepository

  constructor(
    permissionRepository?: PermissionRepository,
    rolePermissionRepository?: RolePermissionRepository
  ) {
    this.permissionRepository = permissionRepository || new PermissionRepository()
    this.rolePermissionRepository = rolePermissionRepository || new RolePermissionRepository()
  }

  async list() {
    const permissions = await this.permissionRepository.findAll()
    return PermissionSerializer.list(permissions)
  }

  async create(input: { action: string; subject: string; label: string; description?: string }) {
    const validationError = validatePermissionParts(input.action, input.subject)
    if (validationError) {
      throw createError({ statusCode: 400, message: validationError })
    }

    const action = normalizePermissionAction(input.action)
    const subject = normalizePermissionSubject(input.subject)
    const key = toPermissionKey(action, subject)
    const label = input.label.trim()
    if (!label) {
      throw createError({ statusCode: 400, message: 'Label is required' })
    }

    const existing = await this.permissionRepository.findByKey(key)
    if (existing) {
      throw createError({ statusCode: 409, message: 'Permission key already exists' })
    }

    const permission = await this.permissionRepository.create({
      key,
      action,
      subject,
      label,
      description: input.description?.trim() || null,
      isSystem: false,
    })

    return PermissionSerializer.formatPermission(permission)
  }

  async update(id: string, input: { label?: string; description?: string | null }) {
    const permission = await this.permissionRepository.findById(id)
    if (!permission) {
      throw createError({ statusCode: 404, message: 'Permission not found' })
    }

    const label = input.label !== undefined ? input.label.trim() : permission.label
    if (!label) {
      throw createError({ statusCode: 400, message: 'Label is required' })
    }

    const updated = await this.permissionRepository.updateById(id, {
      label,
      description: input.description === undefined ? permission.description : (input.description?.trim() || null),
    })

    return PermissionSerializer.formatPermission(updated)
  }

  async delete(id: string) {
    const permission = await this.permissionRepository.findById(id)
    if (!permission) {
      throw createError({ statusCode: 404, message: 'Permission not found' })
    }

    if (permission.isSystem) {
      throw createError({ statusCode: 403, message: 'System permissions cannot be deleted' })
    }

    await this.rolePermissionRepository.deleteByPermissionId(id)
    await this.permissionRepository.deleteById(id)

    return { success: true }
  }
}
