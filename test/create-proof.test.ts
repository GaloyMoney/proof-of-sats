import { createProof, createLiabilitiesTree, toAccountId} from "../src"
import { testAccountsForTree } from "./helper"


describe("createProof function", () => {
  const tree = createLiabilitiesTree(testAccountsForTree as Liability[])
  it("should return a LiabilityProof object", () => {
    const liabilityProof = createProof(toAccountId("01"), tree)
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
    const liabilityProof = createProof(toAccountId("02"), tree)
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
    const liabilityProof = createProof("123" as AccountId, tree)
    expect(liabilityProof).toBeInstanceOf(Error)
  })
})
