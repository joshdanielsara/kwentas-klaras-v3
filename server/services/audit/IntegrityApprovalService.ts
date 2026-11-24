import {
  INTEGRITY_APPROVAL_STATUS,
  type IntegrityApprovalResource,
} from '../../../app/constants/audit/integrityApproval'
import { INTEGRITY_ACTOR_TYPE } from '../../../app/constants/audit/integrityActor'
import { IntegrityApprovalRepository } from '../../repositories/audit/IntegrityApprovalRepository'
import { resolveActivityActor } from '../../utils/auditIntegrity/resolveActivityActor'
import { randomUUID } from 'node:crypto'

export class IntegrityApprovalService {
  private repo: IntegrityApprovalRepository

  constructor(repo?: IntegrityApprovalRepository) {
    this.repo = repo || new IntegrityApprovalRepository()
  }

  /**
   * Create an approval row for a money record when an approver is present.
   * Returns null when there is nothing to bind (no approver / still pending).
   */
  async createForMoneyResource(input: {
    projectId: string
    resourceType: IntegrityApprovalResource
    resourceId: string
    approvedBy?: string | null
    approvedDate?: Date | string | null
    status?: string | null
    actorRoleSnapshot?: string | null
  }) {
    const approvedBy = input.approvedBy?.trim()
    if (!approvedBy) {
      return null
    }

    const status =
      (input.status || '').toLowerCase() === INTEGRITY_APPROVAL_STATUS.APPROVED ||
      Boolean(approvedBy)
        ? INTEGRITY_APPROVAL_STATUS.APPROVED
        : INTEGRITY_APPROVAL_STATUS.PENDING

    const actor = resolveActivityActor({
      actorType: INTEGRITY_ACTOR_TYPE.USER,
      actorId: approvedBy,
      actorRoleSnapshot: input.actorRoleSnapshot,
      source: 'app',
    })

    const approvedAt = input.approvedDate
      ? new Date(input.approvedDate)
      : status === INTEGRITY_APPROVAL_STATUS.APPROVED
        ? new Date()
        : null

    return this.repo.create({
      projectId: input.projectId,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      requestId: randomUUID(),
      status,
      actorType: actor.actorType,
      actorId: actor.actorId,
      actorRoleSnapshot: actor.actorRoleSnapshot,
      note: approvedBy,
      approvedAt,
    })
  }
}
