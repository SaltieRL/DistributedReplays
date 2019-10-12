import * as React from "react"

interface ThemeContextType {
    dark: boolean
    toggleTheme: () => void
}

// tslint:disable-next-line:no-empty
export const ThemeContext = React.createContext<ThemeContextType>({dark: false, toggleTheme: () => undefined})
