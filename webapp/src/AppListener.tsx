import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import * as React from "react"
import { Cookies as ReactCookies } from "react-cookie"
import ReactGA from "react-ga"
import { RouteComponentProps, withRouter } from "react-router"
import { GOOGLE_ANALYTICS_ID, PRIVACY_POLICY_LINK } from "./Globals"

interface State {
    location: string
    notificationOpen: boolean
}

type Props = RouteComponentProps

class AppListenerComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        // const cookies = new ReactCookies()

        this.state = {
            location: "",
            notificationOpen: false //cookies.get("rcl_consent_given") === undefined
        }
        this.onChange = this.onChange.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.onChange(this.props.history.location, this.props.history.action)
        this.props.history.listen(this.onChange)
    }

    public render() {
        return (
            <>
                {this.props.children}
                {this.state.notificationOpen ?
                    <Dialog open={this.state.notificationOpen &&
                    this.props.history.location.pathname !== PRIVACY_POLICY_LINK}>
                        {/*<div style={{*/}
                        {/*position: "fixed", bottom: "0", left: "0",*/}
                        {/*width: "100vw", height: "7vh", backgroundColor: "#ddd",*/}
                        {/*paddingLeft: "15vw", paddingTop: "1vh"*/}
                        {/*}}>*/}

                        <DialogTitle id="alert-dialog-title">We've updated our Privacy Policy.</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <p>This site uses cookies for analytics purposes. By continuing to use the site, you
                                    agree to this use.</p>
                                <p> Additionally, by uploading data to this website, you agree to allow calculated.gg to
                                    have full control of that data. <a href={PRIVACY_POLICY_LINK}>Learn more.</a></p>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary" autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                        {/*</div>*/}
                    </Dialog>
                    : null}
            </>
        )
    }

    public handleClose() {
        this.setState({notificationOpen: false})
        const cookies = new ReactCookies()
        cookies.set("rcl_consent_given", true)
    }

    public onChange(location: any, action: any) {
        const loc = location.pathname + location.search
        const cookies = new ReactCookies()

        if (cookies !== undefined) {
            if (this.state.location !== loc && cookies.get("rcl_consent_given") !== undefined) {
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
                this.state = {
                    location: loc,
                    notificationOpen: this.state.notificationOpen
                }
            }
        }
    }
}

export const AppListener = withRouter(AppListenerComponent)
