import { getLeaf, nodeCombiner, toBalance } from "./utils"

/**
 *
 * @param liabilityProof
 * @param roothash
 * @returns {boolean}
 */

export const isLiabilityIncludedInTree = ({
  liabilityProof,
  roothash,
}: IsLiabilityIncludedInTreeArgs): {
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
      !isPartialProofValid({
        partialLiabilityProof: partialProof,
        roothash,
        accountId: liabilityProof.accountId,
        nonce: liabilityProof.nonce,
      })
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
 * @param roothash
 * @param accountId
 * @param nonce
 * @returns {boolean}
 */
const isPartialProofValid = ({
  partialLiabilityProof,
  roothash,
  accountId,
  nonce,
}: IsPartialProofValidArgs): boolean => {
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
  return currentNode.hash === roothash
}
