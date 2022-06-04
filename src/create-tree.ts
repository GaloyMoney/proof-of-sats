import { createHash } from 'crypto'
import { randomInt, shuffle, nodeCombiner } from './utils'

// TODO: Still have to implement the hashing with nonce and blockheight

/**
 * create a leaf node from a liability by using sha256 algorithm.
 * @param liability
 * @param idx
 * @returns {TreeNode}
 */
export const getLeaf = (liability: Liability, idx: number): TreeNode => {
  const data = `${liability.accountId}${liability.balance}${idx}`
  return {
    hash: createHash('sha256').update(data).digest('hex'),
    sum: liability.balance,
  }
}

/**
 * accept a list of accounts and return a shuffled and stretched list of liabilities
 * @param accounts
 * @returns {Liability[]}
 */

export const createLiabilities = (accounts: Liability[]): Liability[] => {
  let liabilities = accounts.map(({ accountId, balance }) => ({
    accountId: accountId,
    balance: balance,
  }))
  liabilities = shuffle(liabilities)
  const stretchedliabilities = getStretchedLiabilities(liabilities)
  return shuffle(stretchedliabilities)
}

/**
 * generates a tree from the list of accounts containing
 * the acconutId and balance
 * @param accounts
 * @returns {Array<Array<TreeNode>>}
 */
export const createLiabilitiesTree = (accounts: Liability[]) => {
  const liabilities = createLiabilities(accounts)
  const leaves = liabilities.map((liability, idx) => getLeaf(liability, idx))
  const tree = generateTree(leaves)
  return tree.reverse()
}

/**
 * Generate a merkle tree from the leaves
 * @param leaves
 * @returns {Array<Array<TreeNode>>}
 */
export const generateTree = (leaves: TreeNode[]): Array<Array<TreeNode>> => {
  const tree = [leaves]
  let nodesInARow = leaves.length / 2
  let rowIndex = 0
  while (nodesInARow >= 1) {
    const rowNodes: TreeNode[] = []
    for (let i = 0; i < nodesInARow; i++) {
      const leftChild = tree[rowIndex][i * 2]
      const rightChild = tree[rowIndex][i * 2 + 1]
      const node = nodeCombiner(leftChild, rightChild)
      rowNodes.push(node)
    }
    nodesInARow = nodesInARow >> 1
    tree.push(rowNodes)
    rowIndex++
  }
  return tree
}

// IMPORTANT NOTE: At present this function assumes that the liabilities will have an integer balance.
const getStretchedLiabilities = (liabilities: Liability[]): Liability[] => {
  let finalLiabilities: Liability[] = liabilities
  const currSize = liabilities.length * 2
  const treeHeight = Math.ceil(Math.log2(currSize))
  const totalLeaves = Math.pow(2, treeHeight)
  while (finalLiabilities.length < totalLeaves) {
    const stretchedLiabilities: Liability[] = []
    let stretchedLiabilitiesLength = finalLiabilities.length
    finalLiabilities.forEach((liability) => {
      if (liability.balance >= 0 && stretchedLiabilitiesLength < totalLeaves) {
        stretchedLiabilitiesLength++
        const val1: number = randomInt(
          0,
          Math.floor(parseInt(liability.balance.toString()))
        )
        const val2: number = liability.balance - val1
        stretchedLiabilities.push({
          accountId: liability.accountId,
          balance: val1,
        })
        stretchedLiabilities.push({
          accountId: liability.accountId,
          balance: val2,
        })
      } else {
        stretchedLiabilities.push(liability)
      }
    })
    finalLiabilities = stretchedLiabilities
  }

  return finalLiabilities
}
