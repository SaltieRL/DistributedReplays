export const convertSnakeAndCamelCaseToReadable = (camelCaseString: string) => {
    const words = camelCaseString.match(/[A-Za-z][a-z]*/g) || []
    return words.map((word: string) => word.charAt(0).toUpperCase() + word.substr(1)).join(" ")
}

export const convertNumberToMaxDP = (value: number, decimalPoints: number = 2) =>
    (Math.round(value * 10 ** decimalPoints) / 10 ** decimalPoints).toString()
