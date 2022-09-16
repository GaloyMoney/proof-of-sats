import { createProof, createLiabilitiesTree, toAccountId } from "../src"
import { testAccountsForTree } from "./helper"

describe("createProof function", () => {
  const tree = createLiabilitiesTree(testAccountsForTree as Liability[])
  it("should return a LiabilityProof object", () => {
    const accountId = toAccountId("01")
    const liabilityProof = createProof({ accountId, tree })
    if (liabilityProof instanceof Error) throw liabilityProof
    let calculatedBalance = 0
    liabilityProof.partialLiabilityProofs.forEach((proof) => {
      calculatedBalance += proof.balance
    })
    const expectedBalance = liabilityProof.totalBalance
    expect(liabilityProof).toBeInstanceOf(Object)
    expect(liabilityProof.accountId).toBe("01")
    expect(liabilityProof.partialLiabilityProofs).toBeInstanceOf(Array)
    expect(liabilityProof.nonce).toBe(tree.accountToNonceMap.get("01" as AccountId)!)
    expect(calculatedBalance).toBe(expectedBalance)
    expect(liabilityProof.partialLiabilityProofs.length).toBeGreaterThan(1)
  })

  it("should return a LiabilityProof object", () => {
    const accountId = toAccountId("02")
    const liabilityProof = createProof({
      accountId, tree
    })
    const expectedBalance = 0
    let calculatedBalance = 0
    if (liabilityProof instanceof Error) throw liabilityProof
    liabilityProof.partialLiabilityProofs.forEach((proof) => {
      calculatedBalance += proof.balance
    })
    expect(liabilityProof).toBeInstanceOf(Object)
    expect(liabilityProof.nonce).toBe(tree.accountToNonceMap.get(toAccountId("02")))
    expect(calculatedBalance).toBe(expectedBalance)
    expect(liabilityProof.partialLiabilityProofs.length).toBeGreaterThan(1)
  })
  it("should return an empty object for an invalid accountId", () => {
    const accountId = toAccountId("123")
    const liabilityProof = createProof({accountId , tree})
    expect(liabilityProof).toBeInstanceOf(Error)
  })
})
