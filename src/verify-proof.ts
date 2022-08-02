import { getLeaf, nodeCombiner, toBalance } from "./utils"

/**
 *
 * @param liabilityProof
 * @param rootHash
 * @returns {boolean}
 */

export const isLiabilityIncludedInTree = (
  liabilityProof: LiabilityProof,
  rootHash: Hash,
): {
  isProofValid: boolean
  provenBalance: Balance
} => {
  if (liabilityProof.partialLiabilityProofs.length == 0) {
    return {
      isProofValid: false,
      provenBalance: toBalance(0),
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
  return {
    isProofValid: isValid,
    provenBalance: toBalance(provenBalance),
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
  rootHash: Hash,
  accountId: AccountId,
  nonce: Nonce,
): boolean => {
  const merklePath = partialLiabilityProof.merklePath
  const liability: Liability = {
    accountId: accountId,
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
