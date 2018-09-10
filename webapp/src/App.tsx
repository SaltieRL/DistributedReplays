import * as React from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"
import "./App.css"
import {HomePage} from "./Components/Pages/HomePage"
import {PlayerPage} from "./Components/Pages/PlayerPage"

export class App extends React.Component {
    public render() {
        return (
            <Router>
                <div className="App">
                    <Route exact={true} path="/" component={HomePage}/>
                    <Route exact={true} path="/players/overview/:id" component={PlayerPage}/>
                </div>
            </Router>
        )
    }
}

