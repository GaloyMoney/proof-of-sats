import { isLiabilityIncludedInTree, createProof } from "../src/create-proof"
import { tree, treeFromTestAccounts } from "./helper"

describe("test the function isLiabilityIncludedInTree", () => {
  it("should return true for a given liability proof", () => {
    const liabilityProof = createProof("03", tree)
    const verification = isLiabilityIncludedInTree(liabilityProof, tree[0][0].hash)
    expect(verification.isProofValid).toBe(true)
    expect(verification.provenBalance).toBe(liabilityProof.totalBalance)
  })
  it("should return false when a wrong accountId is given to generate the proof", () => {
    const liabilityProof = createProof("123", tree)
    const verification = isLiabilityIncludedInTree(liabilityProof, tree[0][0].hash)
    expect(verification.isProofValid).toBe(false)
    expect(verification.provenBalance).toBe(0)
  })
  it("should return false when a wrong rootHash is given to generate the proof", () => {
    const liabilityProof = createProof("04", tree)
    expect(isLiabilityIncludedInTree(liabilityProof, "3124").isProofValid).toBe(false)
  })
  it("should return true for when accountId is 02", () => {
    const liabilityProof = createProof("02", tree)
    expect(isLiabilityIncludedInTree(liabilityProof, tree[0][0].hash).isProofValid).toBe(
      true,
    )
    expect(isLiabilityIncludedInTree(liabilityProof, tree[0][0].hash).provenBalance).toBe(
      liabilityProof.totalBalance,
    )
  })
})
describe("test the function isLiabilityIncludedInTree using the tree generated from testAccounts", () => {
  const rootHash = treeFromTestAccounts[0][0].hash
  it("should return true for a valid accountId", () => {
    const liabilityProof = createProof("01", treeFromTestAccounts)
    const verification = isLiabilityIncludedInTree(liabilityProof, rootHash)
    expect(verification.isProofValid).toBe(true)
    expect(verification.provenBalance).toBe(liabilityProof.totalBalance)
  })
  it("should return false for invalid accountId", () => {
    const liabilityProof = createProof("123", treeFromTestAccounts)
    expect(isLiabilityIncludedInTree(liabilityProof, rootHash).isProofValid).toBe(false)
  })
  it("should return false for invalid root hash", () => {
    expect(
      isLiabilityIncludedInTree(createProof("01", treeFromTestAccounts), "123")
        .isProofValid,
    ).toBe(false)
  })
})
