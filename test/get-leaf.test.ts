import { getLeaf } from "../src/utils"
describe("test the getLeaf function", () => {
  it("should return a leaf", () => {
    const result = getLeaf({ accountId: "1", balance: 1 }, 0, "12345")
    const expectedHash =
      "c1640f3e7d16949d92d3e975a0c4fbdf0ffc88a0acef9bc16fa88e6ce4a5b1e2"
    expect(result).toBeInstanceOf(Object)
    expect(result).toHaveProperty("hash")
    expect(result).toHaveProperty("sum")
    expect(result.hash).toBe(expectedHash)
  })
})
