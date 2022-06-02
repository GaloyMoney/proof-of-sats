type Liability = {
  accountId: string
  walletBalance: number
}

type Liability = {
  accountId: string
  balance: number
}

type PartialLiabiltyProof = {
  merklePath: TreeNode[]
  balance: number
}

type LiabilityProof = {
  accountId: string
  partialLiabilityProofs: PartialLiabiltyProof[]
}

type provenBalanceForLiability: (liabilityProof: LiabilityProof, publishMerkleRoot: Hash) => {accountId: String, provenBalance: number}


type TreeNode = {
  hash: string
  sum: number
}


type LiabilitiesTree = {
  data: TreeNode[][]
  generateLiabilitiesProof: (liabiity: Liability) => Proof
}

liabilitesProofIsValid: (liability: Liability, proof: Proof) => boolean

type UserInfo = {
  accountId: string
  balance: number
}

// type Proof = TreeNode & {
//   idx: number
// }



type isLiabilityIncludedInTree(liability: Liability, proof: Proof, treeRoot: Hash) => Boolean

// Mobile wallet

const treeRoot = getPublishedTreeRoot() // News paper, Galoy website, bitcoin blockchain
const liabilityProofs = getLiabilityProofsFromGaloyApi()
totalBalance = 0
for (liabilityProof in liabilityProofs) {
  if (isLiabilityIncludedInTree(liabilityProof.liability, liabilityProof.proof, treeRoot)){
    totalBalance += liability.balance
  } 
}

console.log(at)

