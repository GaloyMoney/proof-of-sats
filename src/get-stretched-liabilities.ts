import { randomInt } from "./utils"

// IMPORTANT NOTE: At present this function assumes that the liabilities will have an integer balance.
export const getStretchedLiabilities = (liabilities: Liability[]): Liability[] => {
  let finalLiabilities: Liability[] = liabilities
  const currSize = liabilities.length * 2
  const treeHeight = Math.ceil(Math.log2(currSize))
  const totalLeaves = Math.pow(2, treeHeight)
  while (finalLiabilities.length < totalLeaves) {
    const stretchedLiabilities: Liability[] = []
    let stretchedLiabilitiesLength = finalLiabilities.length
    finalLiabilities.forEach((liability) => {
      if (liability.balance >= 0 && stretchedLiabilitiesLength < totalLeaves) {
        stretchedLiabilitiesLength++
        const val1: number = randomInt(
          0,
          Math.floor(parseInt(liability.balance.toString())),
        )
        const val2: number = liability.balance - val1
        stretchedLiabilities.push({
          accountId: liability.accountId,
          balance: val1,
        })
        stretchedLiabilities.push({
          accountId: liability.accountId,
          balance: val2,
        })
      } else {
        stretchedLiabilities.push(liability)
      }
    })
    finalLiabilities = stretchedLiabilities
  }

  return finalLiabilities
}
