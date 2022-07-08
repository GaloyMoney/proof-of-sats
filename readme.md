# proof-of-liabilities

This library implements proof-of-liabilities for a bitcoin banking infrastructure.
The core motivation behind this library is to provide a simple, easy to use, and secure way to create merkle trees and liability proofs and to provide an easy interface to verify the liability proofs. This library can be used by any individual or organization that want to enable a proof of liabilities system for thier organisation. Proof of Liabilities along with Proof of Reserves can be used to create a Proof of Solvency for an organisation.
```Proof of Reserves + Proof of Liabilities = Proof of Solvency```\
Using Proof of Solvency a bank is able to provide assurance to the client that the bank is solvent and their funds are held securely by the bank. Using Proof Of Liabilities a client can independently verify that his/her funds are held securely by the bank. This increases the trust between the bank and the client.

## Installation

Install the package with:

```bash
npm i proof-of-liabilities
# or
yarn add proof-of-liabilities
```

# Usage

## To generate the liabilities tree
For generating a new liabilites tree, we need to pass in a list of accounts to the ```createLiabilitiesTree``` function. The function will return a ```LiabilityTree``` object.
The ```LiabilityTree``` object has a ```merkleTree``` object which is simply an ```Array<Array<TreeNodes>>```. The ```TreeNode``` object has a ```hash``` and a ```sum``` property. The ```hash``` represents the SHA256 hash of the given node and ```sum``` represents the cumulative sum of all the children to the given node. The ```LiabilityTree``` also returns a Map ```accountToNonceMap``` which is used to store a Nonce associated with a given accountId. 

## Algorithm for generating the ```LiabilityTree```
For the purpose of maintaing privacy and ensuring the safety of the data, every account balance that is passed into the function is split atleast 2 times. Thus if the balance associated with an accountId A is 100 Sats, then in the actual tree, this balance is reflected as a split balance accociated with the same accountId. Before creating the tree the data is also randomly shuffled so as to ensure better privacy. In the ```createLiabilitiesTree``` function, we take this shuffled and randomly split data and start to create the leaves of the merkleTree. A leaf is essentially a TreeNode and it must have a ```hash``` and a `sum` associated with it. The hash is created using the SHA256 algorithm by hashing 
`accountId, nonce, balance and index`. The  `sum` field at the leaf level simply represents the balance associated with that account. The idea to create a parent from the leaves is pretty simple. We start from the leftmost leaf and pick its neighbour. Using these two leaves we create a parent node.The sum associated with a parent node refers to the total sum of its child nodes. We pass these two nodes to a `nodeCombiner` function.The working of a nodeCombiner function is explained below.

```js
/**
 * generates a node of a merkle tree
 * @param leftChild
 * @param rightChild
 * @returns {TreeNode} a node of a merkle tree
 */
export const nodeCombiner = (leftChild: TreeNode, rightChild: TreeNode): TreeNode => {
  const data = `${leftChild.hash}${leftChild.sum}${rightChild.hash}${rightChild.sum}`
  return {
    hash: createHash("sha256").update(data).digest("hex"),
    sum: leftChild.sum + rightChild.sum,
  }
}
```
Once the entire leaf row is traversed we can traverse through the immediate parent nodes and following the above mentioned approach, we can create an entire merkle tree upto the root. The root node should contain a sum that is equal to the total sum of all the leaves.  

## Calling the createLiabilitiesTree function

```js
import { createLiabilitiesTree } from "proof-of-liabilities"

// Accounts refer to a list of accountId's and balances.
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
