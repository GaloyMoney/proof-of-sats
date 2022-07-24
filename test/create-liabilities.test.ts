import { createLiabilities } from "../src"
import { testAccountsForUtils } from "./helper"

describe("test the liabilities function", () => {
  it("should return an array of liabilities", () => {
    const result = createLiabilities(testAccountsForUtils as Liability[])
    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(
      Math.pow(2, Math.ceil(Math.log2(testAccountsForUtils.length * 2))),
    )
  })
  it("should return liabilities that have the same accountId's as present in the testAccounts", () => {
    const result = createLiabilities(testAccountsForUtils as Liability[])
    expect(testAccountsForUtils.map(({ accountId }) => ({ accountId }))).toEqual(
      expect.arrayContaining(result.map(({ accountId }) => ({ accountId }))),
    )
  })
})
