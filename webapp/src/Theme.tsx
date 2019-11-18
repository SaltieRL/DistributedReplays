import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles"
import Chart from "chart.js"
import * as React from "react"
import {ThemeContext} from "./Contexts/ThemeContext"

const getTheme = (dark: boolean) =>
    createMuiTheme({
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
            }
        },
        overrides: dark
            ? {
                  MuiTabs: {
                      root: {color: "white"}
                  }
              }
            : {}
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
        const dark = this.state.dark

        const theme = getTheme(dark)

        Chart.defaults.global.defaultFontColor = dark ? "white" : "grey"
        Chart.defaults.radar.scale.ticks = {
            backdropColor: theme.palette.background.paper
        }

        return (
            <ThemeContext.Provider value={{dark, toggleTheme: this.toggleTheme}}>
                <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
            </ThemeContext.Provider>
        )
    }

    private readonly toggleTheme = () => {
        const darkThemeEnabled = !this.state.dark
        localStorage.setItem(darkThemeStorageKey, String(darkThemeEnabled))
        this.setState({dark: darkThemeEnabled})
    }
}
