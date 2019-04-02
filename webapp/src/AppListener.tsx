import * as React from "react"
import { Cookies as ReactCookies } from "react-cookie"
import ReactGA from "react-ga"
import { RouteComponentProps, withRouter } from "react-router"
import { GOOGLE_ANALYTICS_ID } from "./Globals"

interface State {
    location: string
}

type Props = RouteComponentProps

class AppListenerComponent extends React.Component<Props, State> {
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
        const cookies = new ReactCookies()
        if (cookies !== undefined) {
            console.log(cookies.get("rcl_consent_given"))
            if (this.state.location !== loc && cookies.get("rcl_consent_given") === true) {
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
                this.state = {
                    location: loc
                }
            }
        }
    }
}

export const AppListener = withRouter(AppListenerComponent)
