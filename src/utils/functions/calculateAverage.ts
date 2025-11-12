//Generic function in order to calculate average
export const calculateAverage = (numbers: number[]): number | null => {
    if (numbers.length === 0) return null
    const sum = numbers.reduce((a, b) => a + b, 0)
    return parseFloat((sum / numbers.length).toFixed(2))
}
