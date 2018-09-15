export const convertCamelCaseToReadable = (camelCaseString: string) => {
    const words = camelCaseString.match(/[A-Za-z][a-z]*/g) || []
    return words.map((word: string) => word.charAt(0).toUpperCase() + word.substr(1)).join(" ")
}

export const convertNumberToMaxTwoDP = (value: number) => (Math.round(value * 100) / 100).toString()
