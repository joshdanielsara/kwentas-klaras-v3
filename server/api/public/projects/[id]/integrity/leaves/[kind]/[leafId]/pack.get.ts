import { AuditIntegrityService } from '../../../../../../../../services/audit/AuditIntegrityService'
import { withErrorHandler } from '../../../../../../../../utils/errorHandler'
import {
  INTEGRITY_LEAF_KINDS,
  type IntegrityLeafKind,
} from '../../../../../../../../../app/constants/audit/integrityLeafKinds'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const projectId = getRouterParam(event, 'id')
    const kind = getRouterParam(event, 'kind') as IntegrityLeafKind | undefined
    const leafId = getRouterParam(event, 'leafId')

    if (!projectId || !kind || !leafId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project id, leaf kind, and leaf id are required',
      })
    }

    if (!INTEGRITY_LEAF_KINDS.includes(kind)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Leaf kind must be one of: ${INTEGRITY_LEAF_KINDS.join(', ')}`,
      })
    }

    const pack = await new AuditIntegrityService().getLeafInclusionPack(
      projectId,
      kind,
      leafId
    )

    if (!pack) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No sealed inclusion proof found for this record',
      })
    }

    setHeader(event, 'Content-Type', 'application/json')
    setHeader(
      event,
      'Content-Disposition',
      `attachment; filename="kwentas-klaras-leaf-${kind}-${leafId.slice(0, 12)}.json"`
    )
    return pack
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to build leaf inclusion pack',
  })
})
