# proof-of-liabilities

Library for implementing proof-of-liabilities for bitcoin banking infrastructure.

## Installation

Install the package with:

```bash
npm i proof-of-liabilities
# or
yarn add proof-of-liabilities
```

## Usage

## To generate the liabilities tree

```js
import { createLiabilitiesTree } from "proof-of-liabilities/create-tree"
// accounts = [{accountId: "1", balance: 100}, {accountId: "2", balance: 200}]
/**
 * @param accounts
 * @return {LiabilityTree}
 **/
const tree = createLiabilitiesTree(accounts)
```

## To generate a proof

```js
import { createProof } from "proof-of-liabilities/create-proof"
/**
 * @param tree
 * @param accountId
 * @return {LiabilityProof}
 **/
const liabilityProof = createProof(accountId, tree)
```

## To Validate a proof

```js
import { isLiabilityIncludedInTree } from "proof-of-liabilities/validate-proof"
const isValid: boolean = isLiabilityIncludedInTree(liabilityProof, rootHash)
```

## Methods

- [createLiabilitiesTree](#createLiabilitiesTree) - Generate a liabilities tree from the given list of liabilities.
- [createProof](#createProof) - Generate a proof of liabilities for the given accountId.
- [isLiabilityIncludedInTree](#isLiabilityIncludedInTree) - Validate a proof of liabilities.

### createLiabilitiesTree

Generate a liabilities' tree from the given list of accounts. The function accepts a list of accounts and returns a LiabilityTree. The balance associated with each account is shuffled, split into at-least two parts, and then again shuffled to ensure better privacy of an individual user. For every account a random cryptographically secure nonce is generated and stored as a Map in the LiabilityTree. This nonce is useful for maintaining the privacy of the user since each individual account will have a unique nonce. The leaf hash is obtained by using SHA256 hashing algorithm. The parameters for the hash function includes ```accountId, nonce, balance and the index (of the account in the list)```.
 The structure of a LiabilityTree is defined below.

```js
type LiabilityTree = {
  merkleTree: TreeNode[][]
  nonceMap: Map<string, string>
}

type TreeNode = {
  hash: string
  sum: number
}
```

### createProof

Generate a liability proof for a given accountId.

```js
const createProof = (
  accountId: string,
  tree: LiabilityTree
)
```

A liability proof contains a list of partial liability proof for each user.

```js
type PartialLiabilityProof = {
  merklePath: MerklePath
  idx: number
  liability: Liability
}
```

### isLiabilityIncludedInTree

The function accepts a liability proof and a root hash of the tree and returns a boolean value indicating that whether a given account has been included in the tree.

```js
const isLiabilityIncludedInTree   = (
  liabilityProof: LiabilityProof,
  rootHash: string
):boolean
```

## Test

Test with Jest framework:

```bash
yarn test
```
