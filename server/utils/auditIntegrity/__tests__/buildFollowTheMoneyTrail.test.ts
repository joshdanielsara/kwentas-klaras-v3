import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildFollowTheMoneyTrail } from '../buildFollowTheMoneyTrail'

describe('buildFollowTheMoneyTrail', () => {
  it('builds appropriation then money steps with sealed flags', () => {
    const trail = buildFollowTheMoneyTrail({
      appropriation: 1000,
      budgets: [{ id: 'b1', amount: 200, reason: 'Extra' }],
      obligations: [{ id: 'o1', amount: 500, payee: 'ABC', reason: 'Works' }],
      disbursements: [{ id: 'd1', amount: 100, payee: 'ABC', reason: 'Partial' }],
      sealedFinancial: {
        budgets: { b1: { hash: 'h', snapshot: {} as never } },
        obligations: {},
        disbursements: { d1: { hash: 'h2', snapshot: {} as never } },
      },
    })

    assert.equal(trail.steps[0]?.kind, 'appropriation')
    assert.equal(trail.appropriationTotal, 1200)
    assert.equal(trail.steps.find((s) => s.recordId === 'b1')?.sealed, true)
    assert.equal(trail.steps.find((s) => s.recordId === 'o1')?.sealed, false)
    assert.equal(trail.steps.find((s) => s.recordId === 'd1')?.sealed, true)
  })
})
