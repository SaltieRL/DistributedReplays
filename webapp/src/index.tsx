import * as React from "react"
import * as ReactDOM from "react-dom"
import "./index.css"
import { unregister } from "./registerServiceWorker"
import { WrappedApp } from "./WrappedApp"

ReactDOM.render(
    <WrappedApp/>,
    document.getElementById("root") as HTMLElement
)

// registerServiceWorker()
unregister()
