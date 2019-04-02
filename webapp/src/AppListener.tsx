import * as React from "react"
import ReactGA from "react-ga"
import { RouteComponentProps, withRouter } from "react-router"
import { GOOGLE_ANALYTICS_ID } from "./Globals"

interface State {
    location: string
}

class AppListenerComponent extends React.Component<RouteComponentProps, State> {
    constructor(props: RouteComponentProps) {
        super(props)
        this.state = {
            location: ""
        }
        this.onChange = this.onChange.bind(this)
        this.onChange(this.props.history.location, this.props.history.action)
        this.props.history.listen(this.onChange)
        console.log("Render")
        // todo:
    }

    public render() {
        return (
            <>
                {this.props.children}
            </>
        )
    }

    public onChange(location: any, action: any) {
        const loc = location.pathname + location.search
        if (this.state.location !== loc) {
            console.log("on route change")
            ReactGA.initialize([{
                    trackingId: GOOGLE_ANALYTICS_ID,
                    debug: true,
                    gaOptions: {
                        cookieDomain: "none",
                        siteSpeedSampleRate: 100
                    }
                }]
            )
            ReactGA.pageview(loc)
            console.log(location.pathname + location.search)
            this.setState({location: loc})
        }
    }
}

export const AppListener = withRouter(AppListenerComponent)
