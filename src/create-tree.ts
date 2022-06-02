import { createHash } from 'crypto'
import { randomInt, shuffle } from './utils'

// TODO: Still have to implement the hashing with nonce and blockheight

// generate the leaf containing hash and sum from liability.
const getLeaf = (liability: Liability, idx: number): TreeNode => {
  const data = `${liability.accountId}${liability.walletBalance}${idx}`
  return {
    hash: createHash('sha256').update(data).digest('hex'),
    sum: liability.walletBalance,
  }
}

// Combine the two nodes to generate their parent node
const nodeCombiner = (leftChild: TreeNode, rightChild: TreeNode): TreeNode => {
  const data = `${leftChild.hash}${leftChild.sum}${rightChild.hash}${rightChild.sum}`
  return {
    hash: createHash('sha256').update(data).digest('hex'),
    sum: leftChild.sum + rightChild.sum,
  }
}

// create liabilities from accounts
export const createLiabilities = (accounts: UserInfo[]): Liability[] => {
  let liabilities = accounts.map(({ accountId, balance }) => ({
    accountId: accountId,
    walletBalance: balance,
  }))
  liabilities = shuffle(liabilities)
  const stretchedliabilities = getStretchedLiabilities(liabilities)
  return shuffle(stretchedliabilities)
}

// Create a merkle tree from the accounts
export const createLiabilitiesTreeFromAccounts = (accounts: UserInfo[]) => {
  const liabilities = createLiabilities(accounts)
  const leaves = liabilities.map((liability, idx) => getLeaf(liability, idx))
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
  return LiabilitesTree(tree.reverse())
}


// function to split the liabilities till they are equal to a power of 2
const getStretchedLiabilities = (liabilities: Liability[]): Liability[] => {
  let finalLiabilities: Liability[] = liabilities
  const currSize = liabilities.length * 2
  const treeHeight = Math.ceil(Math.log2(currSize))
  const totalLeaves = Math.pow(2, treeHeight)
  while (finalLiabilities.length < totalLeaves) {
    const stretchedLiabilities: Liability[] = []
    let stretchedLiabilitiesLength = finalLiabilities.length
    finalLiabilities.forEach((liability) => {
      if (
        liability.walletBalance >= 0 &&
        stretchedLiabilitiesLength < totalLeaves
      ) {
        stretchedLiabilitiesLength++
        const val1: number = randomInt(
          0,
          Math.floor(parseInt(liability.walletBalance.toString()))
        )
        const val2: number = liability.walletBalance - val1
        stretchedLiabilities.push({
          accountId: liability.accountId,
          walletBalance: val1,
        })
        stretchedLiabilities.push({
          accountId: liability.accountId,
          walletBalance: val2,
        })
      } else {
        stretchedLiabilities.push(liability)
      }
    })
    finalLiabilities = stretchedLiabilities
  }

  return finalLiabilities
}




const LiabilitiesTree = (treeRows: TreeNode[][]) : LiabilitiesTree => {

  const generateLiabilitiesProof = () => {

  }

  return {
    data: treeRows,
    generateLiabilitiesProof,
  }
}
