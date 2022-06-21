import { createLiabilitiesTree } from "src"
import { isLiabilityIncludedInTree, createProof } from "../src/create-proof"
import { testAccountsForTree } from "./helper"

const tree = createLiabilitiesTree(testAccountsForTree)
const roothash = tree.merkleTree[0][0].hash
describe("test the function isLiabilityIncludedInTree", () => {
  it("should return true for a given liability proof", () => {
    const liabilityProof = createProof("03", tree)
    const verification = isLiabilityIncludedInTree(liabilityProof, roothash)
    expect(verification.isProofValid).toBe(true)
    expect(verification.provenBalance).toBe(liabilityProof.totalBalance)
  })
  it("should return false when a wrong accountId is given to generate the proof", () => {
    const liabilityProof = createProof("123", tree)
    const verification = isLiabilityIncludedInTree(liabilityProof, roothash)
    expect(verification.isProofValid).toBe(false)
    expect(verification.provenBalance).toBe(0)
  })
  it("should return false when a wrong rootHash is given to generate the proof", () => {
    const liabilityProof = createProof("04", tree)
    expect(isLiabilityIncludedInTree(liabilityProof, "3124").isProofValid).toBe(false)
  })
  it("should return true for when accountId is 02", () => {
    const liabilityProof = createProof("02", tree)
    expect(isLiabilityIncludedInTree(liabilityProof, roothash).isProofValid).toBe(true)
    expect(isLiabilityIncludedInTree(liabilityProof, roothash).provenBalance).toBe(
      liabilityProof.totalBalance,
    )
  })
})
describe("test the function isLiabilityIncludedInTree using the tree generated from testAccounts", () => {
  it("should return true for a valid accountId", () => {
    const liabilityProof = createProof("01", tree)
    const verification = isLiabilityIncludedInTree(liabilityProof, roothash)
    expect(verification.isProofValid).toBe(true)
    expect(verification.provenBalance).toBe(liabilityProof.totalBalance)
  })
  it("should return false for invalid accountId", () => {
    const liabilityProof = createProof("123", tree)
    expect(isLiabilityIncludedInTree(liabilityProof, roothash).isProofValid).toBe(false)
  })
  it("should return false for invalid root hash", () => {
    expect(isLiabilityIncludedInTree(createProof("01", tree), "123").isProofValid).toBe(
      false,
    )
  })
})

// describe("test the function isLiabilityIncludedInTree using the tree generated from testAccounts", () => {
//   const rootHash = treeFromTestAccounts[0][0].hash
//   it("should return false when partialLiabilityProofs for wrong accounts are being passed", () => {
//     const liabilityProofForDifferentAccountId: LiabilityProof = {
//       accountId: "01",
//       partialLiabilityProofs: [
//         {
//           merklePath: [
//             {
//               node: {
//                 hash: "6ca43b228c867d686aa56ae6c3f63ee3c02b71592f62f2d02c2621dd24a0eff3",
//                 sum: 71,
//               },
//               index: 2,
//             },
//             {
//               node: {
//                 hash: "a9819fece07ecaa1044acaf20dac98bb66dc20eec1dd520474bbf532c0791ea7",
//                 sum: 0,
//               },
//               index: 0,
//             },
//             {
//               node: {
//                 hash: "ff75e78131e351a66791612c306e842dd95ee2a529ad7aa975e48c78259de84c",
//                 sum: 27,
//               },
//               index: 1,
//             },
//             {
//               node: {
//                 hash: "605b5d486d6421900e6f890ea6478c75fc9351f372ffd07d8a9a7b76ca1b6cbf",
//                 sum: 55,
//               },
//               index: 1,
//             },
//           ],
//           balance: 16,
//           idx: 3,
//         },
//         {
//           merklePath: [
//             {
//               node: {
//                 hash: "689005fb62324b1af98f03592e9044ea9ec941e9f915a273d3ca735b160fbdf2",
//                 sum: 0,
//               },
//               index: 13,
//             },
//             {
//               node: {
//                 hash: "3ddb223999813c67f374e87e820599265c390bf9526537ad440595270d6abfc6",
//                 sum: 20,
//               },
//               index: 7,
//             },
//             {
//               node: {
//                 hash: "92a0d0b36c15b0ccc5999522e45222bac16975d72f7da2031e91583f18cf2725",
//                 sum: 31,
//               },
//               index: 2,
//             },
//             {
//               node: {
//                 hash: "2f3f24746c39ed194854a1bb3e70c72ce5e8edb6ebda2a49cd0f2b81f63c758f",
//                 sum: 114,
//               },
//               index: 0,
//             },
//           ],
//           balance: 4,
//           idx: 12,
//         },
//       ],
//       totalBalance: 23,
//     }
//     let liabilityProof = createProof("03", treeFromTestAccounts)
//     liabilityProof.partialLiabilityProofs =
//       liabilityProofForDifferentAccountId.partialLiabilityProofs
//     const verification = isLiabilityIncludedInTree(liabilityProof, rootHash)
//     expect(verification.isProofValid).toBe(false)
//     expect(verification.provenBalance).not.toBe(liabilityProof.totalBalance)
//   })
// })
