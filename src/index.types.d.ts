type Liability = {
  accountId: string
  balance: number
}

// What should be the correct nomenclature for the MerklePath ?

// Switch type of MerklePath to be an array
type MerklePath = {
  node: TreeNode
  index: number
}[]

//
type PartialLiabilityProof = {
  merklePath: MerklePath
  liability: Liability
  idx: number
}

type LiabilityProof = {
  accountId: string
  partialLiabilityProofs: PartialLiabilityProof[]
}

type TreeNode = {
  hash: string
  sum: number
}
