import { createLiabilitiesTree } from "../src/create-tree"
import { testAccountsForTree } from "./helper"

describe("test the createLiabilitiesTree function", () => {
  it("should return a tree", () => {
    let expectedSum = 0
    testAccountsForTree.forEach((acc) => (expectedSum += acc.balance))
    const tree = createLiabilitiesTree(testAccountsForTree)
    const merkleTree = tree.merkleTree
    const nonce = tree.accountToNonceMap
    expect(tree).toBeInstanceOf(Object)
    expect(nonce.size).toBe(5)
    expect(merkleTree).toBeDefined()
    expect(merkleTree.length).toBe(5)
    expect(merkleTree[0].length).toBe(1) // tree[0] should be an array of length 1 that contains roothash and totalLiabilities sum.
    expect(merkleTree[1].length).toBe(2)
    expect(merkleTree[2].length).toBe(4)
    expect(merkleTree[0][0].sum).toBe(expectedSum) //total sum of all the liabilities
    expect(merkleTree[merkleTree.length - 1].length).toBe(16) // total number of leaves should be 16
    console.log(tree)
  })
})
