import { PermissionService } from '../../services/rbac/PermissionService'
import { RoleService } from '../../services/rbac/RoleService'
import { RbacBootstrapService } from '../../services/rbac/RbacBootstrapService'
import { LocationService } from '../../services/location/LocationService'
import { ServiceService } from '../../services/service/ServiceService'
import { DepartmentService } from '../../services/department/DepartmentService'
import { requireSuperadmin } from '../../utils/requireSuperadmin'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await new RbacBootstrapService().ensureDefaults()
    const [roles, permissions, locations, services, departments] = await Promise.all([
      new RoleService().list(),
      new PermissionService().list(),
      new LocationService().list(),
      new ServiceService().list(),
      new DepartmentService().list(),
    ])

    return {
      success: true,
      summary: {
        roleCount: roles.length,
        permissionCount: permissions.length,
        systemRoleCount: roles.filter((role) => role.isSystem).length,
        customPermissionCount: permissions.filter((permission) => !permission.isSystem).length,
        barangayCount: locations.length,
        serviceCount: services.length,
        implementingUnitCount: departments.length,
      },
    }
  })
})
