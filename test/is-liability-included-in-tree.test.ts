import { createLiabilitiesTree, isLiabilityIncludedInTree, createProof, toAccountId} from "../src"
import { testAccountsForTree } from "./helper"

const tree = createLiabilitiesTree(testAccountsForTree as Liability[])
const roothash = tree.merkleTree[0][0].hash
describe("test the function isLiabilityIncludedInTree", () => {
  it("should return true for a given liability proof", () => {
    const accountId = toAccountId("03")
    const liabilityProof = createProof({accountId , tree})
    if (liabilityProof instanceof Error) throw liabilityProof
    const verification = isLiabilityIncludedInTree({liabilityProof, roothash})
    expect(verification.isProofValid).toBe(true)
    expect(verification.provenBalance).toBe(liabilityProof.totalBalance)
  })
  it("should return false when a wrong accountId is given to generate the proof", () => {
    const accountId = toAccountId("123")
    const liabilityProof = createProof({accountId , tree})
    expect(liabilityProof).toBeInstanceOf(Error)
  })
  it("should return false when a wrong rootHash is given to generate the proof", () => {
    const accountId = toAccountId("04")
    const liabilityProof = createProof({accountId , tree})
    if (liabilityProof instanceof Error) throw liabilityProof
    const hash = '1234' as Hash
    expect(isLiabilityIncludedInTree({liabilityProof , roothash : hash }).isProofValid).toBe(
      false,
    )
  })
  it("should return true for when accountId is 02", () => {
    const accountId = toAccountId("02")
    const liabilityProof = createProof({ accountId, tree})
    if (liabilityProof instanceof Error) throw liabilityProof
    expect(isLiabilityIncludedInTree({liabilityProof , roothash}).isProofValid).toBe(true)
    expect(isLiabilityIncludedInTree({liabilityProof , roothash}).provenBalance).toBe(
      liabilityProof.totalBalance,
    )
  })
})
describe("test the function isLiabilityIncludedInTree using the tree generated from testAccounts", () => {
  it("should return true for a valid accountId", () => {
    const accountId = toAccountId("01")
    const liabilityProof = createProof({ accountId, tree})
    if (liabilityProof instanceof Error) throw liabilityProof
    const verification = isLiabilityIncludedInTree({liabilityProof , roothash})
    expect(verification.isProofValid).toBe(true)
    expect(verification.provenBalance).toBe(liabilityProof.totalBalance)
  })
  it("should return false for invalid accountId", () => {
    const accountId = toAccountId("123")
    const liabilityProof = createProof({accountId , tree})
    expect(liabilityProof).toBeInstanceOf(Error)
  })
  it("should return false for invalid root hash", () => {
    const accountId = toAccountId("01")
    const liabilityProof = createProof({accountId , tree})
    if (liabilityProof instanceof Error) throw liabilityProof
    const hash = '123' as Hash
    expect(isLiabilityIncludedInTree({liabilityProof , roothash : hash}).isProofValid).toBe(
      false,
    )
  })
})
