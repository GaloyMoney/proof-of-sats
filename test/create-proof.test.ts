import { createProof } from "../src/create-proof"
import { testAccountsForTree } from "./helper"
import { createLiabilitiesTree } from "../src/create-tree"

describe("Test the createProof function", () => {
  const tree = createLiabilitiesTree(testAccountsForTree)
  it("should return a LiabilityProof object", () => {
    const liabilityProof = createProof("01", tree)
    let calculatedBalance = 0
    liabilityProof.partialLiabilityProofs.forEach((proof) => {
      calculatedBalance += proof.balance
    })
    const expectedBalance = liabilityProof.totalBalance
    expect(liabilityProof).toBeInstanceOf(Object)
    expect(liabilityProof.noncedAccountId).toBe("01" + tree.nonceMap.get("01"))
    expect(calculatedBalance).toBe(expectedBalance)
    expect(liabilityProof.partialLiabilityProofs.length).toBeGreaterThan(1)
  })
  // test when an account has a balance of 0
  it("should return a LiabilityProof object", () => {
    const liabilityProof = createProof("02", tree)
    const expectedBalance = 0
    let calculatedBalance = 0
    liabilityProof.partialLiabilityProofs.forEach((proof) => {
      calculatedBalance += proof.balance
    })
    expect(liabilityProof).toBeInstanceOf(Object)
    expect(liabilityProof.noncedAccountId).toBe("02" + tree.nonceMap.get("02"))
    expect(calculatedBalance).toBe(expectedBalance)
    expect(liabilityProof.partialLiabilityProofs.length).toBeGreaterThan(1)
  })
  it("should return an empty object for an invalid accountId", () => {
    const liabilityProof = createProof("123", tree)
    expect(liabilityProof).toBeInstanceOf(Object)
    expect(liabilityProof.partialLiabilityProofs.length).toBe(0)
  })
})
