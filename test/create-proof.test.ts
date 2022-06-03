import { createProof } from '../src/create-proof'
import { tree } from './helper'

describe('Test the createProof function', () => {
  it('should return a LiabilityProof object', () => {
    const result = createProof('04', tree)
    const expectedBalance = 121
    let calculatedBalance = 0
    result.partialLiabilityProofs.forEach((proof) => {
      calculatedBalance += proof.balance
    })
    expect(result).toBeInstanceOf(Object)
    expect(result.accountId).toBe('04')
    expect(calculatedBalance).toBe(expectedBalance)
    expect(result.partialLiabilityProofs.length).toBe(2)
  })
  // test when an account has a balance of 0
  it('should return a LiabilityProof object', () => {
    const result = createProof('02', tree)
    const expectedBalance = 0
    let calculatedBalance = 0
    result.partialLiabilityProofs.forEach((proof) => {
      calculatedBalance += proof.balance
    })
    expect(result).toBeInstanceOf(Object)
    expect(result.accountId).toBe('02')
    expect(calculatedBalance).toBe(expectedBalance)
    expect(result.partialLiabilityProofs.length).toBeGreaterThan(1)
  })
})
