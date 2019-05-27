import { Card, CardContent, Grid, Tab, Tabs, Tooltip, Typography, withWidth } from "@material-ui/core"
import { isWidthDown, WithWidth } from "@material-ui/core/withWidth"
import QRCode from "qrcode.react"
import * as React from "react"
import { connect } from "react-redux"

import { Replay } from "../../Models"
import { StoreState } from "../../Redux"
import { PlayerStatsContent } from "./BasicStats/PlayerStats/PlayerStatsContent"
import { TeamStatsContent } from "./BasicStats/TeamStats/TeamStatsContent"
import { HeatmapTabsWrapper } from "./Heatmap/HeatmapTabsWrapper"
import { Predictions } from "./Predictions/Predictions"
import { Viewer } from "./ReplayViewer/Viewer"
import { VisualizationsContent } from "./Visualizations/VisualizationsContent"

interface DisabledTabProps {
    label: string
}

const TabDisabled = (props: DisabledTabProps) => (
    <Tooltip title="In beta; Patrons only">
        <Tab label={props.label} style={{color: "#ccc", cursor: "not-allowed"}}/>
    </Tooltip>
)

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

interface OwnProps {
    replay: Replay
    explanations: Record<string, any> | undefined
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & WithWidth

type ReplayTab =
    | "playerStats"
    | "teamStats"
    | "heatmaps"
    | "visualizations"
    | "replayViewer"
    | "predictions"
    | "qrCode"

interface State {
    selectedTab: ReplayTab
}

class ReplayTabsComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "playerStats"}
    }

    public render() {
        const isWidthSm = isWidthDown("sm", this.props.width)
        const url = `https://calculated.gg/replays/${this.props.replay.id}`
        const qrcode = (
            <CardContent>
                <Grid container justify="center" alignContent="center" spacing={32}>
                    <Grid item xs={12} style={{textAlign: "center"}}>
                        <QRCode value={url}/>
                    </Grid>

                    <Grid item xs={12} style={{textAlign: "center"}}>
                        <Typography>{url}</Typography>
                    </Grid>

                    <Grid item xs={12} style={{textAlign: "center"}}>
                        <Typography>
                            Use this with the <a
                            href="https://play.google.com/store/apps/details?id=gg.calculated.arviewer">AR Replay Viewer
                            mobile app</a> to view this replay in Augmented
                            Reality!
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        )
        return (
            <Card square style={{width: "100%"}}>
                <Tabs
                    value={this.state.selectedTab}
                    onChange={this.handleSelectTab}
                    centered={!isWidthSm}
                    variant={isWidthSm ? "scrollable" : "standard"}
                >
                    <Tab key="basicStats" label="Player Stats" value="playerStats"/>
                    <Tab key="predictions" label="Predictions" value="predictions"/>
                    <Tab key="heatmaps" label="Heatmaps" value="heatmaps"/>
                    {(this.props.loggedInUser && this.props.loggedInUser.beta) ?
                        <Tab key="visualizations" label="Visualizations" value="visualizations"/> :
                        <TabDisabled label="Visualizations"/>
                    }
                    {(this.props.loggedInUser && this.props.loggedInUser.beta) ?
                        <Tab key="teamStats" label="Team Stats" value="teamStats"/> :
                        <TabDisabled label="Team Stats"/>
                    }
                    {this.props.loggedInUser && this.props.loggedInUser.alpha &&
                    [
                        <Tab key="replayViewer" label="Replay Viewer" value="replayViewer"/>
                    ]
                    }

                    <Tab key="qrCode" label="QR Code" value="qrCode"/>
                </Tabs>
                {this.state.selectedTab === "playerStats" && (
                    <PlayerStatsContent
                        replay={this.props.replay}
                        explanations={this.props.explanations}
                    />
                )}
                {this.state.selectedTab === "heatmaps" && (
                    <HeatmapTabsWrapper replay={this.props.replay}/>
                )}
                {this.state.selectedTab === "predictions" && (
                    <Predictions replay={this.props.replay}/>
                )}
                {this.state.selectedTab === "teamStats" && (
                    <TeamStatsContent
                        replay={this.props.replay}
                        explanations={this.props.explanations}
                    />
                )}
                {this.state.selectedTab === "replayViewer" && (
                    <Viewer replayId={this.props.replay.id}/>
                )}
                {this.state.selectedTab === "qrCode" && qrcode}
                {this.state.selectedTab === "visualizations" && (
                    <VisualizationsContent replay={this.props.replay}/>
                )}
            </Card>
        )
    }

    private readonly handleSelectTab = (_: React.ChangeEvent<{}>, selectedTab: ReplayTab) => {
        this.setState({selectedTab})
    }
}

export const ReplayTabs = withWidth()(connect(mapStateToProps)(ReplayTabsComponent))
