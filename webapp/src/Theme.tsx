import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import * as React from "react"

interface ThemeContextType {
    dark: boolean
    toggleTheme: () => void
}

// tslint:disable-next-line:no-empty
export const ThemeContext = React.createContext<ThemeContextType>({dark: false, toggleTheme: () => undefined})

const getTheme = (dark: boolean) => createMuiTheme({
    palette: {
        primary: {
            contrastText: "#000",
            dark: "#808e95",
            light: "#eff5fc",
            main: "#b0bec5"
        },
        secondary: {
            contrastText: "#000",
            dark: "#35a6cb",
            light: "#a9ffff",
            main: "#72d8fe"
        },
        error: {
            contrastText: "#fff",
            dark: "#c20",
            light: "#c20",
            main: "#c20"
        },
        type: dark ? "dark" : "light"
    },
    // Make top bar appear above side bar
    zIndex: {
        appBar: 1200,
        drawer: 1100
    },
    typography: {
        fontFamily: "Lato",
        fontWeightRegular: 300,
        caption: {
            fontWeight: 400
        },
        useNextVariants: true
    },
    overrides: dark ? {
        MuiTabs: {
            root: {color: "white"}
        }
    } : {}
})

interface State {
    dark: boolean
}

const darkThemeStorageKey = "darkThemeEnabled"

export class Theme extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        const darkThemeEnabled = localStorage.getItem(darkThemeStorageKey) === "true"
        this.state = {dark: darkThemeEnabled}
    }

    public render() {
        const theme = getTheme(this.state.dark)
        return (
            <ThemeContext.Provider value={{dark: this.state.dark, toggleTheme: this.toggleTheme}}>
                <MuiThemeProvider theme={theme}>
                    {this.props.children}
                </MuiThemeProvider>
            </ThemeContext.Provider>
        )
    }

    private readonly toggleTheme = () => {
        const darkThemeEnabled = !this.state.dark
        localStorage.setItem(darkThemeStorageKey, String(darkThemeEnabled))
        this.setState({dark: darkThemeEnabled})
    }
}
