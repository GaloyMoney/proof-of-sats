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
import { createLiabilitiesTree } from 'proof-of-liabilities/create-tree'
// userInfo = [{accountId, balance}....]
const tree = createLiabilitiesTree(userInfo)
```

## To generate a proof

```js
import { createProof } from 'proof-of-liabilities/create-proof'
// tree: Array<Array<TreeNode>>
const liabilityProof = createProof(accountId, tree)
```

## To Validate a proof

```js
import { isLiabilityIncludedInTree } from 'proof-of-liabilities/validate-proof'
const isValid: boolean = isLiabilityIncludedInTree(liabilityProof, rootHash)
```

## Methods

- [createLiabilitiesTree](#createLiabilitiesTree) - Generate a liabilities tree from the given list of liabilities.
- [createProof](#createProof) - Generate a proof of liabilities for the given accountId.
- [isLiabilityIncludedInTree](#isLiabilityIncludedInTree) - Validate a proof of liabilities.

### createLiabilitiesTree

Generate a liabilities' tree from the given list of userInfo.
The function accepts a list of userInfo and returns a merkle tree.
The tree is made up of TreeNodes. The structure of a TreeNode is defined below.

```js
TreeNode = {
  hash: string,
  sum: number,
}
```

### createProof

Generate a proof of liability for a given accountId.
A liability proof contains a list of partial liability proof for each user.

```js
partialLiabilityProof = {
    merklePath : MerklePath[],
    balance: number
}
```

### isLiabilityIncludedInTree

The function accepts a liability proof and a root hash of the tree and returns a boolean value indicating that whether a given account has been included in the tree.

## Test

Test with Jest framework:

```bash
yarn test
```
