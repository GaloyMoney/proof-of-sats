import { createProof } from "../src/create-proof"
import { tree, treeFromTestAccounts } from "./helper"

describe("Test the createProof function", () => {
  it("should return a LiabilityProof object", () => {
    const liabilityProof = createProof("04", tree)
    const expectedBalance = 121
    let calculatedBalance = 0
    liabilityProof.partialLiabilityProofs.forEach((proof) => {
      calculatedBalance += proof.balance
    })
    expect(liabilityProof).toBeInstanceOf(Object)
    expect(liabilityProof.accountId).toBe("04")
    expect(calculatedBalance).toBe(expectedBalance)
    expect(liabilityProof.partialLiabilityProofs.length).toBe(2)
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
    expect(liabilityProof.accountId).toBe("02")
    expect(calculatedBalance).toBe(expectedBalance)
    expect(liabilityProof.partialLiabilityProofs.length).toBeGreaterThan(1)
  })
  it("should return an empty object for an invalid accountId", () => {
    const liabilityProof = createProof("123", tree)
    expect(liabilityProof).toBeInstanceOf(Object)
    expect(liabilityProof.partialLiabilityProofs.length).toBe(0)
  })
})

describe("test the create proof function using the tree generated using createLiabilitiesFunction", () => {
  it("should return a LiabilityProof object", () => {
    const liabilityProof = createProof("01", treeFromTestAccounts)
    const expectedBalance = 23
    let calculatedBalance = 0
    liabilityProof.partialLiabilityProofs.forEach((proof) => {
      calculatedBalance += proof.balance
    })
    expect(liabilityProof).toBeInstanceOf(Object)
    expect(liabilityProof.accountId).toBe("01")
    expect(calculatedBalance).toBe(expectedBalance)
  })
})
