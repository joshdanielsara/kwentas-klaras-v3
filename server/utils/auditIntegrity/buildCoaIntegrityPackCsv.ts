import type { AuditIntegrityBatch } from '@prisma/client'

const csvEscape = (value: string): string => {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const toIso = (value?: Date | null): string => {
  if (!value) {
    return ''
  }
  return value.toISOString()
}

/** One CSV row per seal batch for auditor offline review. */
export const buildCoaIntegrityPackCsv = (batches: AuditIntegrityBatch[]): string => {
  const header = [
    'batch_id',
    'merkle_root',
    'status',
    'leaf_count',
    'sealed_at',
    'has_ots_proof',
  ].join(',')

  const rows = batches.map((batch) =>
    [
      csvEscape(batch.id),
      csvEscape(batch.merkleRoot),
      csvEscape(batch.status),
      String(batch.leafCount),
      csvEscape(toIso(batch.sealedAt)),
      batch.otsProof ? 'yes' : 'no',
    ].join(',')
  )

  return [header, ...rows].join('\n')
}
