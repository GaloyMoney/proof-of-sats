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
##  To generate the liabilities tree. 
```js
import {createLiabilities} from 'proof-of-liabilities/create-liabilities'
import {createLiabilitiesTree} from 'proof-of-liabilities/create-tree'
// userInfo = [{accountId, balance}....]
const liabilities = createLiabilites(userInfo)
const tree = createLiabilitiesTree(liabilities)
```

## Methods

- [createLiabilities](#createLiabilities) - Generate a list of liabilities from the userInfo
- [createLiabilitiesTree](#createLiabilitiesTree) - Generate a liabilities tree from the given list of liabilities.

### createLiabilities
Generate a list of liabilities from the userInfo. Internally the function splits and randomly distributes the liabilites. 
### createLiabilitiesTree
Generate a liabilities tree from the given list of liabilities. 
The function accepts a list of liabilities and returns a merkle tree.
The tree is made up of TreeNodes. The structure of a TreeNode is defined below.

```
TreeNode = {
    hash : Hash, 
    sum : number
}