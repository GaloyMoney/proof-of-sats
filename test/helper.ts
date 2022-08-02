import { toAccountId, toBalance } from "../src"
export const testAccountsForUtils = [
  { accountId: "234324", balance: 32413 },
  { accountId: "234342hgdfg4", balance: 3242131 },
  { accountId: "2sfaad34324", balance: 324.243 },
  { accountId: "23434fsd24", balance: 324.21 },
  { accountId: "234jyud324", balance: 3241 },
]

export const testAccountsForTree: Liability[] = [
  { accountId: toAccountId("01"), balance: toBalance(23) },
  { accountId: toAccountId("02"), balance: toBalance(0) },
  { accountId: toAccountId("03"), balance: toBalance(13) },
  { accountId: toAccountId("04"), balance: toBalance(121) },
  { accountId: toAccountId("05"), balance: toBalance(12) },
]
