import { createHash } from "crypto"
import { nodeCombiner } from "./utils"
import { getLeaf } from "./create-tree"
/**
 * returns the calculated hash of the given data
 * @param accountId
 * @param leaf
 * @param idx
 * @returns {string}
 */
const generateLeafForAccount = (
  accountId: string,
  leaf: TreeNode,
  idx: number,
): string => {
  const data = `${accountId}${leaf.sum}${idx}`
  return createHash("sha256").update(data).digest("hex")
}

/**
 * returns PartialProof for a given node
 *
 * @param idx
 * @param tree
 * @param accountId
 * @returns {PartialLiabilityProof}
 */
export const generatePartialProof = (
  idx: number,
  tree: Array<Array<TreeNode>>,
): PartialLiabilityProof => {
  let i = tree.length - 1
  const leafIndex = idx
  const balance = tree[i][idx].sum
  const path: MerklePath = []
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
    balance,
    idx: leafIndex,
  }
}

/**
 * returns the LiabilityProof for a given account
 * @param accountId
 * @param tree
 * @returns {LiabilityProof}
 */

export const createProof = (accountId: string, tree: Array<Array<TreeNode>>) => {
  const leaves = tree[tree.length - 1]
  const leafIndex: Array<number> = []
  leaves.forEach((leaf, idx) => {
    if (leaf.hash === generateLeafForAccount(accountId, leaf, idx)) {
      leafIndex.push(idx)
    }
  })
  const partialLiabilityProofs: PartialLiabilityProof[] = leafIndex.map((idx) => {
    return generatePartialProof(idx, tree)
  })
  // find sum in partialLiabilityProof using reduce.
  let totalBalance = 0
  partialLiabilityProofs.forEach((proof) => (totalBalance += proof.balance))
  return {
    accountId,
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
    if (!isPartialProofValid(partialProof, rootHash, liabilityProof.accountId)) {
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
 * @param partialProof
 * @param rootHash
 * @returns {boolean}
 */
const isPartialProofValid = (
  partialLiabilityProof: PartialLiabilityProof,
  rootHash: string,
  accountId: string,
): boolean => {
  const merklePath = partialLiabilityProof.merklePath
  const liability: Liability = {
    accountId,
    balance: partialLiabilityProof.balance,
  }

  let currentNode = getLeaf(liability, partialLiabilityProof.idx)
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
