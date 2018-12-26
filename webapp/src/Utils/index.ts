export * from "./Chart"
export * from "./Color"
export * from "./String"

export const isDevelopment = () => {
    return process.env.NODE_ENV === "development"
}
