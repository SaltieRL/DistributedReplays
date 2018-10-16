import {Typography} from "@material-ui/core"
import Info from "@material-ui/icons/Info"
import * as React from "react"
import {PLUGINS_LINK} from "../../../Globals"
import {LinkButton} from "../LinkButton"

export class BakkesModAd extends React.PureComponent {
    public render() {
        return (
            <div style={{maxWidth: 400, textAlign: "center", margin: "0 auto 0 auto", paddingBottom: 15}}>
                <Typography variant="subheading">
                    A shoutout for BakkesMod
                </Typography>
                <Typography style={{marginBottom: 7}}>
                    Finding the upload process a bit tedious? BakkesMod can save and upload your replays automatically
                    so you don't have to do any manual work to get these amazing stats!
                </Typography>
                <LinkButton icon={Info} iconType="mui" to={PLUGINS_LINK}>
                    More info
                </LinkButton>
            </div>
        )
    }
}
