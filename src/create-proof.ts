import { generateHashForAccount, toBalance } from "./utils"
/**
 * returns PartialProof for a given node
 *
 * @param idx
 * @param merkleTree
 * @returns {PartialLiabilityProof}
 */
export const generatePartialProof = ({
  idx,
  merkleTree,
}: GeneratePartialProofArgs): PartialLiabilityProof => {
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

export const createProof = ({
  accountId,
  tree,
}: CreateProofArgs): LiabilityProof | Error => {
  const merkleTree = tree.merkleTree
  if (!tree.accountToNonceMap.has(accountId)) return new Error("Account does not exist")
  const nonce = tree.accountToNonceMap.get(accountId)
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
  const partialLiabilityProofs = leafIndex.map((idx) => {
    return generatePartialProof({
      idx,
      merkleTree,
    })
  })
  let totalBalance = 0
  partialLiabilityProofs.forEach((proof) => (totalBalance += proof.balance))

  return {
    accountId,
    nonce,
    partialLiabilityProofs,
    totalBalance: toBalance(totalBalance),
  }
}
