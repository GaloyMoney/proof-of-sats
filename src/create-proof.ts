import { nodeCombiner } from "./utils"
import { getLeaf } from "./utils"
import { generateHashForAccount } from "./utils"
/**
 * returns PartialProof for a given node
 *
 * @param idx
 * @param merkleTree
 * @returns {PartialLiabilityProof}
 */
export const generatePartialProof = (
  idx: number,
  merkleTree: Array<Array<TreeNode>>,
): PartialLiabilityProof => {
  let i = merkleTree.length - 1
  const leafIndex = idx
  const balance = merkleTree[i][idx].sum
  const path: MerklePath = []
  while (i > 0) {
    if (idx % 2 === 0) {
      path.push({ node: merkleTree[i][idx + 1], index: idx + 1 })
    } else {
      path.push({ node: merkleTree[i][idx - 1], index: idx - 1 })
    }
    idx = Math.floor(idx / 2)
    i--
  }
  return {
    merklePath: path,
    balance,
    idx: leafIndex,
  }
}

/**
 * returns the LiabilityProof for a given account
 * @param accountId
 * @param tree
 * @returns {LiabilityProof} liabilityProof for a given account
 */

export const createProof = (
  accountId: string,
  tree: LiabilityTree,
): LiabilityProof | Error => {
  const merkleTree = tree.merkleTree
  const nonce = tree.nonceMap.get(accountId)
  if (!nonce) {
    return new Error("Account not found")
  }
  const leaves = merkleTree[merkleTree.length - 1]
  const leafIndex: Array<number> = []
  leaves.forEach((leaf, idx) => {
    if (leaf.hash === generateHashForAccount(accountId, nonce, leaf, idx)) {
      leafIndex.push(idx)
    }
  })
  const partialLiabilityProofs: PartialLiabilityProof[] = leafIndex.map((idx) => {
    return generatePartialProof(idx, merkleTree)
  })
  let totalBalance = 0
  partialLiabilityProofs.forEach((proof) => (totalBalance += proof.balance))

  return {
    accountId,
    nonce,
    partialLiabilityProofs,
    totalBalance,
  }
}
/**
 *
 * @param liabilityProof
 * @param rootHash
 * @returns {boolean}
 */

export const isLiabilityIncludedInTree = (
  liabilityProof: LiabilityProof,
  rootHash: string,
): {
  isProofValid: boolean
  provenBalance: number
} => {
  if (liabilityProof.partialLiabilityProofs.length == 0) {
    return {
      isProofValid: false,
      provenBalance: 0,
    }
  }
  let isValid = true
  let provenBalance = 0
  liabilityProof.partialLiabilityProofs.forEach((partialProof) => {
    if (
      !isPartialProofValid(
        partialProof,
        rootHash,
        liabilityProof.accountId,
        liabilityProof.nonce,
      )
    ) {
      isValid = false
    } else {
      provenBalance += partialProof.balance
    }
  })

  // What should be the return type of this function ?
  return {
    isProofValid: isValid,
    provenBalance,
  }
}

/**
 *  Accepts a rootHash and a PartialLiabilityProof and returns true if the proof is valid
 * @param partialLiabilityProof
 * @param rootHash
 * @param accountId
 * @param nonce
 * @returns {boolean}
 */
const isPartialProofValid = (
  partialLiabilityProof: PartialLiabilityProof,
  rootHash: string,
  accountId: string,
  nonce: string,
): boolean => {
  const merklePath = partialLiabilityProof.merklePath
  const liability: Liability = {
    accountId,
    balance: partialLiabilityProof.balance,
  }

  let currentNode = getLeaf(liability, partialLiabilityProof.idx, nonce)
  let rightNode: TreeNode
  let leftNode: TreeNode
  for (let i = 0; i < merklePath.length; i++) {
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
