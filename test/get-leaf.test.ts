import { getLeaf } from "../src/create-tree"

describe("test the getLeaf function", () => {
  it("should return a leaf", () => {
    const result = getLeaf({ accountId: "1", balance: 1 }, 0)
    const expectedHash =
      "9bdb2af6799204a299c603994b8e400e4b1fd625efdb74066cc869fee42c9df3"
    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty("hash")
    expect(result).toHaveProperty("sum")
    expect(result.hash).toBe(expectedHash)
  })
})
