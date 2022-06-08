import { createHash } from 'crypto'
import { nodeCombiner } from './utils'


/**
 * returns the calculated hash of the given data
 * @param accountId
 * @param leaf
 * @param idx
 * @returns {string}
 */
// This shouldn't be exported
export const generateLeafForAccount = (
  accountId: string,
  leaf: TreeNode,
  idx: number
): string => {
  const data = `${accountId}${leaf.sum}${idx}`
  return createHash('sha256').update(data).digest('hex')
}

/**
 * returns PartialProof for a given node
 *
 * @param idx
 * @param tree
 * @returns {PartialLiabilityProof}
 */
export const generatePartialProof = (
  idx: number,
  tree: Array<Array<TreeNode>>
): PartialLiabilityProof => {
  let i = tree.length - 1
  const path: MerklePath[] = []
  const balance = tree[i][idx].sum
  // The leaf should not be a part of the path, as it will be generated from other data in the PartialLiabilityProof
  path.push({ node: tree[i][idx], index: idx })
  while (i > 0) {
    if (idx % 2 === 0) {
      path.push({ node: tree[i][idx + 1], index: idx + 1 })
    } else {
      path.push({ node: tree[i][idx - 1], index: idx - 1 })
    }
    idx = Math.floor(idx / 2)
    i--
  }
  return {
    merklePath: path,
    balance: balance,
  }
}

/**
 * returns the LiabilityProof for a given account
 * @param accountId
 * @param tree
 * @returns {LiabilityProof}
 */
export const createProof = (
  accountId: string,
  tree: Array<Array<TreeNode>>
): LiabilityProof => {
  const leaves = tree[tree.length - 1]
  const leafIndex: Array<number> = []
  leaves.forEach((leaf, idx) => {
    if (leaf.hash === generateLeafForAccount(accountId, leaf, idx))
      leafIndex.push(idx)
  })
  const partialLiabilityProofs: PartialLiabilityProof[] = leafIndex.map((idx) =>
    generatePartialProof(idx, tree)
  )
  return {
    accountId: accountId,
    partialLiabilityProofs: partialLiabilityProofs,
  }
}

export const isLiabilityIncludedInTree = (
  liabilityProof: LiabilityProof,
  rootHash: string
) => {
  if (liabilityProof.partialLiabilityProofs.length == 0) {
    return false
  }
  let isValid = true
  liabilityProof.partialLiabilityProofs.forEach((partialProof) => {
    // You need to check to make sure that each partial proof starts off with a node that has the correct account id
    if (!isPartialProofValid(partialProof.merklePath, rootHash)) {
      isValid = false
    }
  })
  return isValid
}

export const provenLiabilityBalance = (liabilityProof: LiabilityProof, rootHash: string) : number => {
  // using similar code from isLiabilityIncludedInTree return the total amount of money that is proven to be a part of the balance
}


/**
 *  Accepts a rootHash and a list of merklePaths and returns if the proof is valid
 * @param merklePath 
 * @param rootHash 
 * @returns {boolean}
 */
// should take in a partial proof as an argument
const isPartialProofValid = (
  partialProof: PartialLiabilityProof
): boolean => {
  let currentNode = merklePath[0].node // You need to create the first node in the path using create leaf from partialProof.liability and partialProof.index
  let rightNode: TreeNode
  let leftNode: TreeNode
  for (let i = 1; i < merklePath.length; i++) {
    if (merklePath[i].index % 2 == 1) {
      rightNode = merklePath[i].node
      leftNode = currentNode
    } else {
      leftNode = merklePath[i].node
      rightNode = currentNode
    }
    currentNode = nodeCombiner(leftNode, rightNode)
  }
  return currentNode.hash === rootHash
}
