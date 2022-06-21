type Liability = {
  accountId: string
  balance: number
}

// What should be the correct nomenclature for the MerklePath ?
type MerklePath = {
  node: TreeNode
  index: number
}[]

type PartialLiabilityProof = {
  merklePath: MerklePath
  idx: number // This would help us to create a leaf while trying to create a proof
  balance: number // This would help us to create a leaf while trying to create a proof
}

type LiabilityProof = {
  noncedAccountId: string
  partialLiabilityProofs: PartialLiabilityProof[]
  totalBalance: number
}

type TreeNode = {
  hash: string
  sum: number
}

type Tree = {
  merkleTree: Array<Array<TreeNode>>
  nonceMap: Map<string, string>
}
