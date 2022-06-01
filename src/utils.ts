// to generate a random integer between min (inclusive) and max (inclusive).
export const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// function to shuffle the array
export const shuffle = <T>(arr : T[]): T[] =>{
    let curr = arr.length
    let temp
    let randIdx
    while (curr > 0) {
        curr--
        randIdx = Math.floor(Math.random() * curr)
        temp = arr[curr]
        arr[curr] = arr[randIdx]
        arr[randIdx] = temp
    }
    return arr
}

