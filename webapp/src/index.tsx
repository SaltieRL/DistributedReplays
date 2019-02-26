import MomentUtils from "@date-io/moment"
import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiPickersUtilsProvider } from "material-ui-pickers"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { App } from "./App"
import "./index.css"
import { store } from "./Redux"
import { unregister } from "./registerServiceWorker"
import { Theme } from "./Theme"

ReactDOM.render(
    <Provider store={store}>
        <Theme>
            <CssBaseline/>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <App/>
            </MuiPickersUtilsProvider>
        </Theme>
    </Provider>,
    document.getElementById("root") as HTMLElement
)

// registerServiceWorker()
unregister()
