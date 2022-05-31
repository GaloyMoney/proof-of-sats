const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


export const createLiabilities = (accounts: UserInfo[]): Liability[] => {
    let liabilites: Liability[] = []
    accounts.forEach((account) => {
        liabilites.push({
            accountId: account.accountId.toString(),
            walletBalance: parseInt(account.balance.toString())
        })
    })
    liabilites = randomlyDistributeLiabilities(liabilites)
    const stretchedLiabilites = getStretchedLiabilities(liabilites)
    return randomlyDistributeLiabilities(stretchedLiabilites)

}

const randomlyDistributeLiabilities = (liabilities: Liability[]): Liability[] => {
    let curr = liabilities.length
    while (curr > 0) {
        curr--
        const idx = Math.floor(Math.random() * curr)
        const temp = liabilities[curr]
        liabilities[curr] = liabilities[idx]
        liabilities[idx] = temp
    }
    return liabilities
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
