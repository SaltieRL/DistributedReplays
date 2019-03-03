import { Card, CardContent, Grid, Tab, Tabs, Typography, withWidth } from "@material-ui/core"
import { isWidthDown, WithWidth } from "@material-ui/core/withWidth"
import QRCode from "qrcode.react"
import * as React from "react"
import { connect } from "react-redux"
import { Replay } from "../../Models"
import { StoreState } from "../../Redux"
import { PlayerStatsContent } from "./BasicStats/PlayerStats/PlayerStatsContent"
import { TeamStatsContent } from "./BasicStats/TeamStats/TeamStatsContent"
import { PredictionsContent } from "./PredictionsContent"
import { ReplayViewer } from "./ReplayViewer/ReplayViewer"

interface OwnProps {
    replay: Replay
    predictedRanks?: Predictions
    explanations: Record<string, any> | undefined
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & WithWidth

type ReplayTab =
    | "playerStats"
    | "teamStats"
    | "advancedStats"
    | "replayViewer"
    | "predictions"
    | "qrCode"

interface State {
    selectedTab: ReplayTab
}

class ReplayTabsComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { selectedTab: "playerStats" }
    }

    public render() {
        const { loggedInUser, predictedRanks } = this.props
        const { selectedTab } = this.state
        const isWidthSm = isWidthDown("sm", this.props.width)
        const url = `https://calculated.gg/replays/${this.props.replay.id}`
        const qrcode = (
            <CardContent>
                <Grid container justify="center" alignContent="center" spacing={32}>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <QRCode value={url} />
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Typography>{url}</Typography>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Typography>
                            Use this with the AR Replay Viewer mobile app to view this replay in
                            Augmented Reality!
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        )
        return (
            <Card square style={{ width: "100%" }}>
                <Tabs
                    value={selectedTab}
                    onChange={this.handleSelectTab}
                    centered={!isWidthSm}
                    variant={isWidthSm ? "scrollable" : "fullWidth"}
                >
                    <Tab key="basicStats" label="Player Stats" value="playerStats" />
                    {predictedRanks && (
                        <Tab key="predictions" label="Predictions" value="predictions" />
                    )}
                    {loggedInUser && loggedInUser.beta && (
                        <Tab key="teamStats" label="Team Stats" value="teamStats" />
                    )}
                    {loggedInUser &&
                        loggedInUser.alpha && [
                            <Tab
                                key="advancedStats"
                                label="Advanced Stats"
                                value="advancedStats"
                            />,
                            <Tab key="replayViewer" label="Replay Viewer" value="replayViewer" />
                        ]}

                    <Tab key="qrCode" label="QR Code" value="qrCode" />
                </Tabs>
                {selectedTab === "playerStats" && (
                    <PlayerStatsContent
                        replay={this.props.replay}
                        explanations={this.props.explanations}
                    />
                )}
                {selectedTab === "predictions" && (
                    <PredictionsContent
                        replay={this.props.replay}
                        predictedRanks={predictedRanks}
                    />
                )}
                {selectedTab === "teamStats" && (
                    <TeamStatsContent
                        replay={this.props.replay}
                        explanations={this.props.explanations}
                    />
                )}
                {selectedTab === "replayViewer" && <ReplayViewer replay={this.props.replay} />}
                {selectedTab === "qrCode" && qrcode}
            </Card>
        )
    }

    private readonly handleSelectTab = (_: React.ChangeEvent<{}>, selectedTab: ReplayTab) => {
        this.setState({ selectedTab })
    }
}

export const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

export const ReplayTabs = withWidth()(connect(mapStateToProps)(ReplayTabsComponent))
