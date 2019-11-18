import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core"
import {LocationListener} from "history"
import * as React from "react"
import {Cookies as ReactCookies} from "react-cookie"
import ReactGA from "react-ga"
import {RouteComponentProps, withRouter} from "react-router"
import {GOOGLE_ANALYTICS_ID, PRIVACY_POLICY_LINK} from "./Globals"

interface State {
    location: string
    notificationOpen: boolean
}

type Props = RouteComponentProps

class AppListenerComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            location: "",
            notificationOpen: false
        }

        this.onChange(this.props.history.location, this.props.history.action)
        this.props.history.listen(this.onChange)
    }

    public render() {
        return (
            <>
                {this.props.children}
                {this.state.notificationOpen ? (
                    <Dialog
                        open={
                            this.state.notificationOpen && this.props.history.location.pathname !== PRIVACY_POLICY_LINK
                        }
                    >
                        <DialogTitle id="alert-dialog-title">We've updated our Privacy Policy.</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <p>
                                    This site uses cookies for analytics purposes. By continuing to use the site, you
                                    agree to this use.
                                </p>
                                <p>
                                    {" "}
                                    Additionally, by uploading data to this website, you agree to allow calculated.gg to
                                    have full control of that data.
                                    <a href={PRIVACY_POLICY_LINK}>Learn more.</a>
                                </p>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary" autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                ) : null}
            </>
        )
    }

    private readonly handleClose = () => {
        this.setState({notificationOpen: false})
        const cookies = new ReactCookies()
        cookies.set("rcl_consent_given", true)
    }

    private readonly onChange: LocationListener = (location) => {
        const loc = location.pathname + location.search
        const cookies = new ReactCookies()

        if (cookies !== undefined) {
            if (this.state.location !== loc && window.location.href.includes("https://calculated.gg")) {
                ReactGA.initialize([
                    {
                        trackingId: GOOGLE_ANALYTICS_ID,
                        debug: false,
                        gaOptions: {
                            cookieDomain: "none",
                            siteSpeedSampleRate: 100
                        }
                    }
                ])
                ReactGA.pageview(loc)
                this.setState({location: loc})
            }
        }
    }
}

export const AppListener = withRouter(AppListenerComponent)
