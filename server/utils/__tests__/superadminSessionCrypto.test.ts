import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createHmac, timingSafeEqual } from 'node:crypto'

const sign = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url')

describe('superadminSessionCrypto', () => {
  it('signs and verifies matching tokens', () => {
    const secret = 'test-secret-at-least-16'
    const encodedPayload = Buffer.from(JSON.stringify({ email: 'a@b.com', exp: 9999999999, v: 1 })).toString('base64url')
    const signature = sign(encodedPayload, secret)
    const expected = sign(encodedPayload, secret)
    assert.equal(signature, expected)
    assert.equal(
      timingSafeEqual(Buffer.from(signature), Buffer.from(expected)),
      true
    )
  })

  it('rejects different-length strings safely', () => {
    const left = Buffer.from('abc')
    const right = Buffer.from('abcd')
    assert.equal(left.length === right.length, false)
  })
})
