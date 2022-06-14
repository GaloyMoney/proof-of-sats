import { createLiabilities } from "../src/create-tree"
import { testAccounts } from "./helper"

describe("test the liabilities function", () => {
  it("should return an array of liabilities", () => {
    const result = createLiabilities(testAccounts)
    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(
      Math.pow(2, Math.ceil(Math.log2(testAccounts.length * 2))),
    )
  })
  it("should return liabilities that have the same accountId's as present in the testAccounts", () => {
    const result = createLiabilities(testAccounts)
    expect(testAccounts.map(({ accountId }) => ({ accountId }))).toEqual(
      expect.arrayContaining(result.map(({ accountId }) => ({ accountId }))),
    )
  })
})
