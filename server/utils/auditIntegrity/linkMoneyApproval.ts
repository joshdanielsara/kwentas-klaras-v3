import type { IntegrityApprovalResource } from '../../../app/constants/audit/integrityApproval'
import { IntegrityApprovalService } from '../../services/audit/IntegrityApprovalService'

type MoneyUpdater = (id: string, data: { approvalId: string }) => Promise<unknown>

/**
 * After a money row is created, bind an IntegrityApproval when an approver is set.
 */
export const linkMoneyApproval = async (input: {
  projectId: string
  resourceType: IntegrityApprovalResource
  resourceId: string
  approvedBy?: string | null
  approvedDate?: Date | string | null
  status?: string | null
  updateResource: MoneyUpdater
  approvalService?: IntegrityApprovalService
}): Promise<string | null> => {
  const service = input.approvalService || new IntegrityApprovalService()
  const approval = await service.createForMoneyResource({
    projectId: input.projectId,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    approvedBy: input.approvedBy,
    approvedDate: input.approvedDate,
    status: input.status,
  })

  if (!approval) {
    return null
  }

  await input.updateResource(input.resourceId, { approvalId: approval.id })
  return approval.id
}
