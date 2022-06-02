type Liability = {
  accountId: string
  walletBalance: number
}

type TreeNode = {
  hash: string
  sum: number
}

type UserInfo = {
  accountId: string
  balance: number
}

type Proof = TreeNode & {
  idx: number
}
