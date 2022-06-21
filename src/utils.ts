import { createHash, randomBytes } from "crypto"

// to generate a random integer between min (inclusive) and max (inclusive).
export const randomInt = (min = 0, max: number): number => {
  if (min > max) {
    const temp = min
    min = max
    max = temp
  }
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// function to shuffle the array
export const shuffle = <T>(arr: T[]): T[] => {
  const result = arr.map((element) => element)
  let curr = result.length
  let temp
  let randIdx
  while (curr > 0) {
    curr--
    randIdx = Math.floor(Math.random() * curr)
    temp = result[curr]
    result[curr] = result[randIdx]
    result[randIdx] = temp
  }
  return result
}

// Combine the two nodes to generate their parent node
export const nodeCombiner = (leftChild: TreeNode, rightChild: TreeNode): TreeNode => {
  const data = `${leftChild.hash}${leftChild.sum}${rightChild.hash}${rightChild.sum}`
  return {
    hash: createHash("sha256").update(data).digest("hex"),
    sum: leftChild.sum + rightChild.sum,
  }
}

export const randomString = (length = 32): string => {
  return randomBytes(length).toString("hex").slice(0, length)
}

/**
 * create a leaf node from a liability by using sha256 algorithm.
 * @param liability
 * @param idx
 * @returns {TreeNode} a leaf node
 */
export const getLeaf = (liability: Liability, idx: number, nonce: string): TreeNode => {
  // const data = `${liability.accountId}${liability.balance}${idx}`
  const hash = createHash("sha256")
  hash.update(liability.accountId)
  hash.update(nonce)
  hash.update(liability.balance.toString())
  hash.update(idx.toString())

  return {
    hash: hash.digest("hex"),
    sum: liability.balance,
  }
}

/**
 * returns the calculated hash of the given data
 * @param accountId
 * @param nonce
 * @param leaf node
 * @param idx
 * @returns {string} a SHA256 hash of the given data
 */

export const generateHashForAccount = (
  accountId: string,
  nonce: string,
  leaf: TreeNode,
  idx: number,
): string => {
  const hash = createHash("sha256")
  hash.update(accountId)
  hash.update(nonce)
  hash.update(leaf.sum.toString())
  hash.update(idx.toString())
  return hash.digest("hex")
}
