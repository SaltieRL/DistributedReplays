import {CssBaseline} from "@material-ui/core"
import * as React from "react"
import * as ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {App} from "./App"
import "./index.css"
import {store} from "./Redux"
import {unregister} from "./registerServiceWorker"
import {Theme} from "./Theme"

ReactDOM.render(
    <Provider store={store}>
        <Theme>
            <CssBaseline/>
            <App/>
        </Theme>
    </Provider>,
    document.getElementById("root") as HTMLElement
)

// registerServiceWorker()
unregister()
