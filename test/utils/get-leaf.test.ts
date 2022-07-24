import { createHash } from "crypto"
import {getLeaf} from "../../src"

describe("Test the getLeaf function", ()=>{
  const liability : Liability = {
    accountId : "124-356-347-293-344" as AccountId,
    balance : 214 as Balance
  }
  const index = 13 
  const nonce = 'wertyuiokjhgfdsxcvbn765qwert' as Nonce
  const hash = createHash('sha256')
  hash.update(liability.accountId)
  hash.update(nonce)
  hash.update(liability.balance.toString())
  hash.update(index.toString())
  const expectedHash = hash.digest('hex')
  const expectedBalance = 214
  it("should return a valid hash when correct arguments are passed", ()=>{
    const leaf = getLeaf(liability, index , nonce)
    expect(leaf).toHaveProperty("hash")
    expect(leaf).toHaveProperty("sum")
    expect(leaf.hash).toBe(expectedHash)
    expect(leaf.sum).toBe(expectedBalance)
  })
  it("should return an invalid hash when wrong arguments are passed", ()=>{
    const leaf = getLeaf(liability,index, "abcdefg" as Nonce)
    expect(leaf.hash).not.toBe(expectedHash)
    expect(leaf.sum).toBe(expectedBalance)
  })
})
