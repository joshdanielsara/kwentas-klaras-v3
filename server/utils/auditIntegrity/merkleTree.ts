import { createHash } from 'node:crypto'

const sha256Hex = (input: string | Buffer): string => {
  return createHash('sha256').update(input).digest('hex')
}

const pairHash = (left: string, right: string): string => {
  return sha256Hex(Buffer.from(left + right, 'utf8'))
}

export interface MerkleProofStep {
  sibling: string
  position: 'left' | 'right'
}

export const buildMerkleRoot = (leaves: string[]): string => {
  if (leaves.length === 0) {
    return sha256Hex('')
  }

  let level = [...leaves]
  while (level.length > 1) {
    const next: string[] = []
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i]
      const right = level[i + 1] ?? left
      next.push(pairHash(left, right))
    }
    level = next
  }
  return level[0]
}

export const buildMerkleProof = (leaves: string[], index: number): MerkleProofStep[] => {
  if (index < 0 || index >= leaves.length) {
    throw new Error('Merkle leaf index out of range')
  }

  const proof: MerkleProofStep[] = []
  let level = [...leaves]
  let idx = index

  while (level.length > 1) {
    const isRight = idx % 2 === 1
    const pairIndex = isRight ? idx - 1 : idx + 1
    const sibling = level[pairIndex] ?? level[idx]
    proof.push({
      sibling,
      position: isRight ? 'left' : 'right',
    })

    const next: string[] = []
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i]
      const right = level[i + 1] ?? left
      next.push(pairHash(left, right))
    }
    level = next
    idx = Math.floor(idx / 2)
  }

  return proof
}

export const verifyMerkleProof = (
  leaf: string,
  proof: MerkleProofStep[],
  expectedRoot: string
): boolean => {
  let hash = leaf
  for (const step of proof) {
    hash =
      step.position === 'left'
        ? pairHash(step.sibling, hash)
        : pairHash(hash, step.sibling)
  }
  return hash === expectedRoot
}
