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

## To generate the liabilities tree.

```js
import { createLiabilitiesTree } from 'proof-of-liabilities/create-tree'
// userInfo = [{accountId, balance}....]
const tree = createLiabilitiesTree(userInfo)
```

## Methods

- [createLiabilitiesTree](#createLiabilitiesTree) - Generate a liabilities tree from the given list of liabilities.

### createLiabilitiesTree

Generate a liabilities' tree from the given list of userInfo.
The function accepts a list of userInfo and returns a merkle tree.
The tree is made up of TreeNodes. The structure of a TreeNode is defined below.

```
TreeNode = {
    hash : Hash,
    sum : number
}
```

## Test

Test with Jest framework:

```bash
yarn test
```
