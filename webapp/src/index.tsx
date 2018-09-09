import {CssBaseline} from "@material-ui/core"
import * as React from "react"
import * as ReactDOM from "react-dom"
import {App} from "./App"
import "./index.css"
import registerServiceWorker from "./registerServiceWorker"
import {Theme} from "./Theme"

ReactDOM.render(
    <Theme>
        <CssBaseline/>
        <App/>
    </Theme>,
    document.getElementById("root") as HTMLElement
)
registerServiceWorker()
