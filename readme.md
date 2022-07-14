# proof-of-liabilities

This library implements proof-of-liabilities for a bitcoin banking infrastructure.
The core motivation behind this library is to provide a simple, easy to use, and secure way to create merkle trees and liability proofs and to provide an easy interface to verify the liability proofs. This library can be used by any individual or organization that want to enable a proof of liabilities system for thier organisation. Proof of Liabilities along with Proof of Reserves can be used to create a Proof of Solvency for an organisation.
`Proof of Reserves + Proof of Liabilities = Proof of Solvency`\
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

For generating a new liabilites tree, we need to pass in a list of accounts to the `createLiabilitiesTree` function. The function will return a `LiabilityTree` object.
The `LiabilityTree` object has a `merkleTree` object which is simply an `Array<Array<TreeNodes>>`. The `TreeNode` object has a `hash` and a `sum` property. The `hash` represents the SHA256 hash of the given node and `sum` represents the cumulative sum of all the children to the given node. The `LiabilityTree` also returns a Map `accountToNonceMap` which is used to store a Nonce associated with a given accountId.

## Algorithm for generating the `LiabilityTree`

For the purpose of maintaing privacy and ensuring the safety of the data, every account balance that is passed into the function is split atleast 2 times. Thus if the balance associated with an accountId A is 100 Sats, then in the actual tree, this balance is reflected as a split balance accociated with the same accountId. Before creating the tree the data is also randomly shuffled so as to ensure better privacy. In the `createLiabilitiesTree` function, we take this shuffled and randomly split data and start to create the leaves of the merkleTree. A leaf is essentially a TreeNode and it must have a `hash` and a `sum` associated with it. The hash is created using the SHA256 algorithm by hashing
`accountId, nonce, balance and index`. The `sum` field at the leaf level simply represents the balance associated with that account. The idea to create a parent from the leaves is pretty simple. We start from the leftmost leaf and pick its neighbour. Using these two leaves we create a parent node.The sum associated with a parent node refers to the total sum of its child nodes. We pass these two nodes to a `nodeCombiner` function.The working of a nodeCombiner function is explained below.

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

A `createProof` function can be called to generate a liabilityProof for a given account. The `createProof` function takes in the `accountId` and the `LiabilityTree` object and returns a `LiabilityProof` object. A `LiabilityProof` object is defined below.

```js
type LiabilityProof = {
  accountId: string
  nonce: string
  partialLiabilityProofs: PartialLiabilityProof[]
  totalBalance: number
}
```

The `partialLiabilityProofs` field is a list of `PartialLiabilityProof` objects. The structure of a `PartialLiabilityProof` object is defined below.

```js
type PartialLiabilityProof = {
  merklePath: MerklePath
  idx: number
  balance: number
}
```

The `merklePath` field is contains a list of `TreeNode` and `index`. The `index` refers to the position of the leaf. This `index` will be useful once, we try to validate the generated proof.

## Algorithm for generating a liabilityProof

As one may notice, the liabilityProof object consists of a list of partialLiabilityProofs, this is because we created the tree by splitting the account balance associated with a given account into many smaller balances. So for creating the proof we need to take into account all these smaller balances that are now distributed as a leaf nodes. To find a leaf node that belongs to a particular account, we travel all the leaf nodes and try to find that leaf node whose hash matches with the hash generated by hashing `accountId, nonce(this can be extracted from the accountToNonceMap present on the LiabilityTree object), sum (present on the leaf node) and index(while traveling the leaf nodes we can easily maintaitn an index)`. Once a given node is identified for an account we can store its index to generate the merklePath. A `generatePartialProof` function takes in an `index` and the `merkleTree` and returns a partialLiabilityProof object. The `generatePartialProof` function will generate a merklePath from the index that is passed to it as a parameter. It does so by identifying whether at the present level the node is a left or right child. If at the present level the node is a left child we must add the right child to the list of merkle path and if it is a right child we must add the left child to the list of merkle path. Using this approach we can create the immediate parent node. Now we move a level upwards and try to identify if the this immediate parent is a left node or a right node. If the immediate parent is a left node we must add the corresponding right node to the list of merkle path else we should add left node to the list of merkle path. We again move a level upwards and repeat the same process until we reach the root.
At the end of the process we will have a list of nodes through which we can trace the path to the root and this will enable us to generate our own roothash which we can validate agaist the published roothash and verify if our liability was correctly included in the liability tree.
The partialLiabilityProof object also contains an `idx` field and a `balance` field. These field refer to the balance and index of the node which we identified for given account. `balance` and `idx` will be used to validate the proof as we will see in the later section.

## Calling the createProof function

```js
import { createProof } from "proof-of-liabilities/"
/**
 * @param tree
 * @param accountId
 * @return {LiabilityProof}
 **/
const liabilityProof = createProof(accountId, tree)
```

## To Validate a proof

In order to validate a generated proof we can make a call to the `isLiabilityIncludedInTree` function. The function takes in two parameters, the `LiabilityProof` object and a `roothash` against which the passed LiabilityProof will be validated. The function returns an object which is described as below.

```js
{
  isProofValid: boolean
  provenBalance: number
}
```

The `provenBalance` field can be matched against the `totalBalance` field that is present on the `liabilityProof` object to validate if both the balances match.

## Algorithm for validating a liabilityProof

To validate a liabilityProof we need to validate individual partialLiabilityProof. We use an internal function `isPartialProofValid` which takes in `roothash, partialLiabilityProof, accountId and nonce` as parameters. The approach is to first create a leaf node that must be equal to the leaf node which we identified belonged to a particular account while generating the proof. Once we have obtained this leaf node we pop out the first element present in the merklePath list. We use nodeCombiner function to obtain the corresponding parent from these two leaf nodes. Based on the value of index present in the merklePath object we can identify which node has to be treated as a left node and which has to be treated as a right node. We follow this approach till we obtain a roothash. We then validate this roothash against the roothash that is passed in as a parameter to the function. If both the roothash match then the partialLiabilityProof is valid and we add its `balance` to the `provenBalance` which is initially 0.
Now we pass in all the paritalLiabilityProofs one by one to the `isPartialProofValid` and even if a single partialProof is not valid we return `isProofValid` as `false` and `provenBalance` as `0`, otherwise we return `isProofValid` as `true` and `provenBalance` as the sum of all the `balance` fields of the partialLiabilityProofs.

## Calling the isLiabilityIncludedInTree function

```js
import { isLiabilityIncludedInTree } from "proof-of-liabilities"
const isValid: boolean = isLiabilityIncludedInTree(liabilityProof, rootHash)
```

# Types defined in this library

The below section covers a list of all the types that are defined in this library. Most of the types are self explanatory.

```js
type Liability = {
  accountId: string
  balance: number
}

type MerklePath = {
  node: TreeNode
  index: number
}[]

type PartialLiabilityProof = {
  merklePath: MerklePath
  idx: number
  balance: number
}

type LiabilityProof = {
  accountId: string
  nonce: string
  partialLiabilityProofs: PartialLiabilityProof[]
  totalBalance: number
}

type TreeNode = {
  hash: string
  sum: number
}

type LiabilityTree = {
  merkleTree: Array<Array<TreeNode>>
  accountToNonceMap: Map<string, string>
}

```

# Test

Test with Jest framework:

```bash
yarn test
```
