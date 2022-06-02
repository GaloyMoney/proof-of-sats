import { shuffle } from '../../src/utils'

describe('test shuffle', () => {
  const arr = [
    12,
    '3123',
    312.32,
    'galoy',
    { accountId: '123asdfg', walletBalance: 123.12 },
  ]
  it('should return a shuffled array', () => {
    const result = shuffle(arr)
    expect(result.length).toBe(arr.length)
    expect(result).not.toEqual(arr)
    expect(result).toEqual(expect.arrayContaining(arr))
    expect(result[0]).not.toEqual(arr[0])
  })
})
