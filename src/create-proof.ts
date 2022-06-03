// Still a work in progress!!

import { createHash } from 'crypto'

export const generateLeafForAccount = (
  accountId: string,
  leaf: TreeNode,
  idx: number
): string => {
  const data = `${accountId}${leaf.sum}${idx}`
  return createHash('sha256').update(data).digest('hex')
}

export const generatePartialProof = (
  idx: number,
  tree: Array<Array<TreeNode>>
): PartialLiabilityProof => {
  let i = tree.length - 1
  const path: MerklePath[] = []
  const balance = tree[i][idx].sum
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
