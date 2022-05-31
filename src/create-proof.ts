// Still a work in progress!!

// TODO: complete the function that fetches the tree

import {createHash} from 'crypto'
const getTree = ():Array<TreeNode>[] => {
    return []
}

const createHashForAccount = (accountId: string, idx : number,leaf: TreeNode)=>{
    return createHash('sha256').update(`${accountId}${leaf.sum}${idx}`).digest('hex')
}

export const createProof = (accountId : string): Proof[] =>{
    // get the tree
    // from the tree construct the proof for the given accountId
    const tree : Array<TreeNode> []  = getTree()
    const leaves = tree[0]
    const index : Array<number> = []
    leaves.forEach((leaf,idx)=>{
        if (leaf.hash === createHashForAccount(accountId, idx,leaf)){
            index.push(idx)
        }     
    })
    return []
}
