import {createHash} from "crypto";

// TODO: Still have to implement the hashing with nonce and blockheight
// generate the initial hash and sum that is present on the leaf. 

const getLeaf = (liability: Liability, idx: number): TreeNode => {
    const data = `${liability.accountId}${liability.walletBalance}${idx}`
    return {
        hash: createHash('sha256').update(data).digest('hex'),
        sum: liability.walletBalance
    }
}

const nodeCombiner = (leftChild: TreeNode, rightChild: TreeNode): TreeNode => {
    const data = `${leftChild.hash}${leftChild.sum}${rightChild.hash}${rightChild.sum}`
    return {
        hash: createHash('sha256').update(data).digest('hex'),
        sum: leftChild.sum + rightChild.sum
    }
}
export const createLiabilitiesTree = (liabilites: Liability[]) => {
    const leaves = liabilites.map((liability, idx) => getLeaf(liability, idx))
    const tree = [leaves]
    let nodesInARow = leaves.length / 2
    let rowIndex = 0
    while (nodesInARow >= 1) {
        const rowNodes: TreeNode[] = []
        for (let i = 0; i < nodesInARow; i++) {
            const leftChild = tree[rowIndex][i * 2]
            const rightChild = tree[rowIndex][i * 2 + 1]
            const node = nodeCombiner(leftChild, rightChild)
            rowNodes.push(node)
        }
        nodesInARow = nodesInARow >> 1
        tree.push(rowNodes)
        rowIndex++
    }
    return tree.reverse()
}