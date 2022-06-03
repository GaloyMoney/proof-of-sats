import { isLiabilityIncludedInTree, createProof } from '../src/create-proof'
import { tree } from './helper'

describe('test the function isLiabilityIncludedInTree', () => {
  it('should return true for a given liability proof', () => {
    const liabilityProof = createProof('03', tree)
    expect(isLiabilityIncludedInTree(liabilityProof, tree[0][0].hash)).toBe(
      true
    )
  })
  it('should return false when a wrong accountId is given to generate the proof', () => {
    const liabilityProof = createProof('123', tree)
    expect(isLiabilityIncludedInTree(liabilityProof, tree[0][0].hash)).toBe(
      false
    )
  })
  it('should return false when a wrong rootHash is given to generate the proof', () => {
    const liabilityProof = createProof('04', tree)
    expect(isLiabilityIncludedInTree(liabilityProof, '3124')).toBe(false)
  })
  it('should return true for when accountId is 02', () => {
    const liabilityProof = createProof('02', tree)
    expect(isLiabilityIncludedInTree(liabilityProof, tree[0][0].hash)).toBe(
      true
    )
  })
})
