import MomentUtils from "@date-io/moment"
import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import * as React from "react"
import { Provider } from "react-redux"
import { App } from "./App"
import { store } from "./Redux"
import { Theme } from "./Theme"

export class WrappedApp extends React.Component {
    public render() {
        return (
            <Provider store={store}>
                <Theme>
                    <CssBaseline/>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <App/>
                    </MuiPickersUtilsProvider>
                </Theme>
            </Provider>
        )
    }
}
