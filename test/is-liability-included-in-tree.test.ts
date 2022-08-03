import { createLiabilitiesTree, isLiabilityIncludedInTree, createProof  } from "../src"
import { testAccountsForTree } from "./helper"

const tree = createLiabilitiesTree(testAccountsForTree as Liability[])
const roothash = tree.merkleTree[0][0].hash
describe("test the function isLiabilityIncludedInTree", () => {
  it("should return true for a given liability proof", () => {
    const liabilityProof = createProof("03" as AccountId, tree)
    if (liabilityProof instanceof Error) throw liabilityProof
    const verification = isLiabilityIncludedInTree(liabilityProof, roothash)
    expect(verification.isProofValid).toBe(true)
    expect(verification.provenBalance).toBe(liabilityProof.totalBalance)
  })
  it("should return false when a wrong accountId is given to generate the proof", () => {
    const liabilityProof = createProof("123" as AccountId, tree)
    expect(liabilityProof).toBeInstanceOf(Error)
  })
  it("should return false when a wrong rootHash is given to generate the proof", () => {
    const liabilityProof = createProof("04" as AccountId, tree)
    if (liabilityProof instanceof Error) throw liabilityProof
    expect(isLiabilityIncludedInTree(liabilityProof, "3124" as Hash).isProofValid).toBe(false)
  })
  it("should return true for when accountId is 02", () => {
    const liabilityProof = createProof("02" as AccountId, tree)
    if (liabilityProof instanceof Error) throw liabilityProof
    expect(isLiabilityIncludedInTree(liabilityProof, roothash).isProofValid).toBe(true)
    expect(isLiabilityIncludedInTree(liabilityProof, roothash).provenBalance).toBe(
      liabilityProof.totalBalance,
    )
  })
})
describe("test the function isLiabilityIncludedInTree using the tree generated from testAccounts", () => {
  it("should return true for a valid accountId", () => {
    const liabilityProof = createProof("01" as AccountId, tree)
    if (liabilityProof instanceof Error) throw liabilityProof
    const verification = isLiabilityIncludedInTree(liabilityProof, roothash)
    expect(verification.isProofValid).toBe(true)
    expect(verification.provenBalance).toBe(liabilityProof.totalBalance)
  })
  it("should return false for invalid accountId", () => {
    const liabilityProof = createProof("123" as AccountId, tree)
    expect(liabilityProof).toBeInstanceOf(Error)
  })
  it("should return false for invalid root hash", () => {
    const liabilityProof = createProof("01" as AccountId, tree)
    if (liabilityProof instanceof Error) throw liabilityProof
    expect(isLiabilityIncludedInTree(liabilityProof, "123" as Hash).isProofValid).toBe(false)
  })
})
