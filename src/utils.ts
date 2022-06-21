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
