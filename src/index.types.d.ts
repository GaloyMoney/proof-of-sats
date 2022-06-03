type Liability = {
  accountId: string
  balance: number
}

// What should be the correct nomenclature for the MerklePath ?
type MerklePath = {
  node: TreeNode
  index: number
}

type PartialLiabilityProof = {
  merklePath: MerklePath[]
  balance: number
}

type LiabilityProof = {
  accountId: string
  partialLiabilityProofs: PartialLiabilityProof[]
}

type TreeNode = {
  hash: string
  sum: number
}
