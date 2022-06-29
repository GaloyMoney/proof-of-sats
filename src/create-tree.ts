import { shuffle, nodeCombiner, randomString, getLeaf } from "./utils"
import { getStretchedLiabilities } from "./get-stretched-liabilities"

// TODO: Still have to implement the hashing with nonce and blockheight

/**
 * accept a list of accounts and return a shuffled and stretched list of liabilities
 * @param accounts
 * @returns {Liability[]} a shuffled and stretched list of liabilities
 */

export const createLiabilities = (accounts: Liability[]): Liability[] => {
  let liabilities = accounts.map(({ accountId, balance }) => ({
    accountId,
    balance,
  }))
  liabilities = shuffle(liabilities)
  const stretchedliabilities = getStretchedLiabilities(liabilities)
  return shuffle(stretchedliabilities)
}

/**
 * generates a tree from the list of accounts containing
 * the accountId and balance
 * @param accounts
 * @returns {LiabilityTree} a LiabilityTree object containing merkleTree and nonceMap
 */
export const createLiabilitiesTree = (accounts: Liability[]): LiabilityTree => {
  const timeStamp = Date.now()
  const accountToNonceMap = new Map<string, string>()
  accounts.forEach((acc) => {
    accountToNonceMap.set(acc.accountId, randomString(32))
  })
  const liabilities = createLiabilities(accounts)
  const leaves = liabilities.map((liability, idx) =>
    getLeaf(liability, idx, accountToNonceMap.get(liability.accountId)!),
  )
  const merkleTree = generateTree(leaves)
  return {
    merkleTree: merkleTree.reverse(),
    accountToNonceMap,
    timeStamp,
  }
}

/**
 * Generate a merkle tree from the leaves
 * @param leaves
 * @returns {Array<Array<TreeNode>>} a merkleTree
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
