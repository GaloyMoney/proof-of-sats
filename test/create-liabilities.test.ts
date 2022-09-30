import { createLiabilities } from "../src"
import { testAccountsForTree } from "./helper"

describe("createLiabilities function", () => {
  it("should return an array of liabilities", () => {
    const result = createLiabilities(testAccountsForTree)
    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(
      Math.pow(2, Math.ceil(Math.log2(testAccountsForTree.length * 2))),
    )
  })

  it("should return liabilities that have the same accountId's as present in the testAccounts", () => {
    const result = createLiabilities(testAccountsForTree as Liability[])
    expect(testAccountsForTree.map(({ accountId }) => ({ accountId }))).toEqual(
      expect.arrayContaining(result.map(({ accountId }) => ({ accountId }))),
    )
  })
})
