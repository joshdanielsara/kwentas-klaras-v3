import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildMerkleProof, buildMerkleRoot, verifyMerkleProof } from '../merkleTree'

describe('merkleTree', () => {
  it('builds a root for a single leaf', () => {
    const leaf = 'a'.repeat(64)
    assert.equal(buildMerkleRoot([leaf]), leaf)
  })

  it('verifies inclusion proofs', () => {
    const leaves = [
      '1111111111111111111111111111111111111111111111111111111111111111',
      '2222222222222222222222222222222222222222222222222222222222222222',
      '3333333333333333333333333333333333333333333333333333333333333333',
    ]
    const root = buildMerkleRoot(leaves)
    for (let i = 0; i < leaves.length; i += 1) {
      const proof = buildMerkleProof(leaves, i)
      assert.equal(verifyMerkleProof(leaves[i], proof, root), true)
    }
  })

  it('fails when leaf is tampered', () => {
    const leaves = [
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    ]
    const root = buildMerkleRoot(leaves)
    const proof = buildMerkleProof(leaves, 0)
    assert.equal(verifyMerkleProof('cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', proof, root), false)
  })
})
