import * as React from "react"
import { Cookies as ReactCookies } from "react-cookie"
import { RouteComponentProps, withRouter } from "react-router"
import { Grid, IconButton, Modal, Typography } from "@material-ui/core"
import Close from "@material-ui/icons/Close"
import ReactGA from "react-ga"
import { GOOGLE_ANALYTICS_ID } from "./Globals"

interface State {
    location: string
    notificationOpen: boolean
}

type Props = RouteComponentProps

class AppListenerComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        const cookies = new ReactCookies()

        this.state = {
            location: "",
            notificationOpen: cookies.get("rcl_consent_given") === undefined
        }
        this.onChange = this.onChange.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.onChange(this.props.history.location, this.props.history.action)
        this.props.history.listen(this.onChange)
        console.log("Render")
        // todo:
    }

    public render() {
        const msg = "This site uses cookies for analytics purposes. " +
            "By continuing to use the site, you agree to this use."

        const closeButton = (
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
            >
                <Close/>
            </IconButton>
        )
        return (
            <>
                {this.props.children}
                {this.state.notificationOpen ?
                    <Modal open={this.state.notificationOpen}>
                        {/*<div style={{*/}
                        {/*position: "fixed", bottom: "0", left: "0",*/}
                        {/*width: "100vw", height: "7vh", backgroundColor: "#ddd",*/}
                        {/*paddingLeft: "15vw", paddingTop: "1vh"*/}
                        {/*}}>*/}
                        <Grid container>
                            <Grid item xs={9}>
                                <Typography>{msg}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                {closeButton}
                            </Grid>
                        </Grid>
                        {/*</div>*/}
                    </Modal>
                    : null}
            </>
        )
    }

    public handleClose() {
        console.log("Closing!")
        this.setState({notificationOpen: false})
        const cookies = new ReactCookies()
        cookies.set("rcl_consent_given", true)
    }

    public onChange(location: any, action: any) {
        const loc = location.pathname + location.search
        const cookies = new ReactCookies()

        if (cookies !== undefined) {
            console.log(cookies.get("rcl_consent_given"))
            if (this.state.location !== loc && cookies.get("rcl_consent_given") !== undefined) {
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
                    location: loc,
                    notificationOpen: this.state.notificationOpen
                }
            }
        }
    }
}

export const AppListener = withRouter(AppListenerComponent)
