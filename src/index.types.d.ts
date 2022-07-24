type Hash = string & { readonly brand: unique symbol }

type AccountId = string & { readonly brand: unique symbol }

type Balance = number & { readonly brand: unique symbol }

type Nonce = string & { readonly brand: unique symbol }

type Liability = {
  readonly accountId: AccountId
  readonly balance: Balance
}

type MerklePath = {
  readonly node: TreeNode
  index: number
}[]

type PartialLiabilityProof = {
  readonly merklePath: MerklePath
  idx: number
  readonly balance: Balance
}

type LiabilityProof = {
  readonly accountId: AccountId
  readonly nonce: Nonce
  readonly partialLiabilityProofs: PartialLiabilityProof[]
  readonly totalBalance: Balance
}

type TreeNode = {
  readonly hash: Hash
  readonly sum: Balance
}

type LiabilityTree = {
  readonly merkleTree: Array<Array<TreeNode>>
  readonly accountToNonceMap: Map<AccountId, Nonce>
}
