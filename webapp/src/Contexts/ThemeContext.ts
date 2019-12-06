import * as React from "react"

interface ThemeContextType {
    dark: boolean
    toggleTheme: () => void
    blueColor: string
    orangeColor: string
}

// tslint:disable-next-line:no-empty
export const ThemeContext = React.createContext<ThemeContextType>({
    dark: false,
    toggleTheme: () => undefined,
    blueColor: "blue",
    orangeColor: "orange"
})
