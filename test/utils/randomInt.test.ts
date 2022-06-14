import { randomInt } from "../../src/utils"

describe("test randomInt", () => {
  it("should return a random integer between min (inclusive) and max (inclusive)", () => {
    const min = 0
    const max = 10
    const result = randomInt(min, max)
    expect(result).toBeGreaterThanOrEqual(min)
    expect(result).toBeLessThanOrEqual(max)
  })
  it("should return 0 when max and min are 0", () => {
    const min = 0
    const max = 0
    const result = randomInt(min, max)
    expect(result).toBe(0)
  })
  it("should return a random integer between max(inclusive) and min(inclusive) when min is greater than max", () => {
    const min = 10
    const max = 0
    const result = randomInt(min, max)
    expect(result).toBeGreaterThanOrEqual(max)
    expect(result).toBeLessThanOrEqual(min)
  })
  it("should return 123 when max and min both are equal to 123", () => {
    const min = 123
    const max = 123
    const result = randomInt(min, max)
    expect(result).toBe(123)
  })
})
