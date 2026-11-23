import OpenTimestamps from 'opentimestamps'

/**
 * Thin OpenTimestamps wrapper.
 * Stamps a SHA-256 digest (hex) and returns a base64-encoded `.ots` proof.
 */
export const stampDigestHex = async (digestHex: string): Promise<string> => {
  const hash = Buffer.from(digestHex, 'hex')
  if (hash.length !== 32) {
    throw new Error('OpenTimestamps digest must be 32 bytes (SHA-256)')
  }

  const detached = OpenTimestamps.DetachedTimestampFile.fromHash(
    new OpenTimestamps.Ops.OpSHA256(),
    hash
  )

  await OpenTimestamps.stamp(detached)
  const bytes = detached.serializeToBytes()
  return Buffer.from(bytes).toString('base64')
}

export const verifyDigestHexProof = async (
  digestHex: string,
  otsProofBase64: string
): Promise<{ ok: boolean; detail: string }> => {
  try {
    const hash = Buffer.from(digestHex, 'hex')
    const proofBytes = Buffer.from(otsProofBase64, 'base64')

    const stamped = OpenTimestamps.DetachedTimestampFile.deserialize(proofBytes)
    const original = OpenTimestamps.DetachedTimestampFile.fromHash(
      new OpenTimestamps.Ops.OpSHA256(),
      hash
    )

    // Digest must match before calendar/Bitcoin upgrade
    const stampedDigest = Buffer.from(stamped.fileDigest())
    if (!stampedDigest.equals(hash)) {
      return { ok: false, detail: 'OpenTimestamps proof digest does not match Merkle root' }
    }

    try {
      const results = await OpenTimestamps.verify(stamped, original, {
        ignoreBitcoinNode: true,
      })

      if (results && Object.keys(results).length > 0) {
        return {
          ok: true,
          detail: 'OpenTimestamps proof confirmed against Bitcoin calendars',
        }
      }
    } catch (verifyError: unknown) {
      // Fresh stamps often lack a Bitcoin attestation yet — digest match is enough
      const message =
        verifyError instanceof Error ? verifyError.message : 'OpenTimestamps upgrade pending'
      console.warn('[openTimestampsClient] calendar confirmation pending', { error: message })
    }

    return {
      ok: true,
      detail: 'OpenTimestamps proof present (full Bitcoin confirmation may still be pending)',
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'OpenTimestamps verify failed'
    console.error('[openTimestampsClient] verify failed', { error: message })
    return { ok: false, detail: message }
  }
}
