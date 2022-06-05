import { createLiabilitiesTree } from '../src/create-tree'
import { testAccountsForTree } from './helper'

describe('test the createLiabilitesTree function', () => {
  it('should return a tree', () => {
    let expectedSum = 0
    testAccountsForTree.forEach((acc) => (expectedSum += acc.balance))
    const tree = createLiabilitiesTree(testAccountsForTree)
    expect(tree).toBeDefined()
    expect(tree.length).toBe(5)
    expect(tree[0].length).toBe(1) // tree[0] should be an array of length 1 that contains roothash and totalLiabilities sum.
    expect(tree[1].length).toBe(2)
    expect(tree[2].length).toBe(4)
    expect(tree[0][0].sum).toBe(expectedSum) //total sum of all the liabilities
    expect(tree[tree.length - 1].length).toBe(16) // total number of leaves should be 16
    console.log(tree)
  })
})
