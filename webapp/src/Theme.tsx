import {MuiThemeProvider} from "@material-ui/core"
import {createMuiTheme} from "@material-ui/core/styles"
import * as React from "react"

const theme = createMuiTheme({
    palette: {
        primary: {
            contrastText: "#000",
            dark: "#808e95",
            light: "#e2f1f8",
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
        }
    },
    // Make top bar appear above side bar
    zIndex: {
        appBar: 1200,
        drawer: 1100
    },
    typography: {
        fontFamily: "Lato",
        fontWeightRegular: 300
    }
})


export class Theme extends React.Component {
    public render() {
        return (
            <MuiThemeProvider theme={theme}>
                {this.props.children}
            </MuiThemeProvider>
        )
    }
}
