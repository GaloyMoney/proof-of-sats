import { randomInt, shuffle } from './utils'

export const createLiabilities = (accounts: UserInfo[]): Liability[] => {
    let liabilities = accounts.map(({ accountId, balance }) => ({ accountId: accountId, walletBalance: balance }))
    liabilities = shuffle(liabilities)
    const stretchedliabilities = getStretchedLiabilities(liabilities)
    return shuffle(stretchedliabilities)
}

const getStretchedLiabilities = (liabilities: Liability[]): Liability[] => {
    let finalLiabilities: Liability[] = liabilities
    const currSize = liabilities.length * 2
    const treeHeight = Math.ceil(Math.log2(currSize))
    const totalLeaves = Math.pow(2, treeHeight)
    while (finalLiabilities.length < totalLeaves) {
        const stretchedLiabilities: Liability[] = []
        let stretchedLiabilitiesLength = finalLiabilities.length
        finalLiabilities.forEach((liability) => {
            if (liability.walletBalance >= 0 && stretchedLiabilitiesLength < totalLeaves) {
                stretchedLiabilitiesLength++
                const val1: number = randomInt(
                    0,
                    Math.floor(parseInt(liability.walletBalance.toString())),
                )
                const val2: number = liability.walletBalance - val1
                stretchedLiabilities.push({
                    accountId: liability.accountId,
                    walletBalance: val1
                })
                stretchedLiabilities.push({
                    accountId: liability.accountId,
                    walletBalance: val2
                })
            } else {
                stretchedLiabilities.push(liability)
            }
        })
        finalLiabilities = stretchedLiabilities
    }

    return finalLiabilities
}
