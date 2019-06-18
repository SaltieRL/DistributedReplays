import { Divider, Grid, Paper, Tab, Tabs, Typography, withWidth } from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"
import { PlaylistMetadata, playlists } from "../../Utils/Playlists"
import { LeaderboardList } from "./LeaderboardList"

export interface LeaderboardWithMetadata extends PlaylistLeaderboard {
    playlistMetadata: PlaylistMetadata
}

interface OwnProps {
    leaderboards: PlaylistLeaderboard[]
}

type Props = OwnProps & WithWidth

type PlaylistTab = "Standard Ranked" | "Extra Modes Ranked" | "Standard Unranked"
const playlistTabs: PlaylistTab[] = ["Standard Ranked", "Extra Modes Ranked", "Standard Unranked"]

interface State {
    selectedTab: PlaylistTab
}

class PlaylistLeaderboardGridComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Standard Ranked"}
    }

    public render() {
        const {leaderboards, width} = this.props

        const leaderboardsWithMetadata: LeaderboardWithMetadata[] = []

        leaderboards.forEach((leaderboard) => {
            const metadata = playlists.find((playlist) => playlist.value === leaderboard.playlist)
            if (metadata !== undefined) {
                leaderboardsWithMetadata.push({
                    playlistMetadata: metadata,
                    ...leaderboard
                })
            }
        })

        let filteredLeaderboardsWithMetadata: LeaderboardWithMetadata[]
        switch (this.state.selectedTab) {
            case "Standard Ranked":
                filteredLeaderboardsWithMetadata = leaderboardsWithMetadata.filter(
                    (leaderboard) => leaderboard.playlistMetadata.ranked && leaderboard.playlistMetadata.standardMode
                )
                break
            case "Extra Modes Ranked":
                filteredLeaderboardsWithMetadata = leaderboardsWithMetadata.filter(
                    (leaderboard) => leaderboard.playlistMetadata.ranked && !leaderboard.playlistMetadata.standardMode
                )
                break
            case "Standard Unranked":
                filteredLeaderboardsWithMetadata = leaderboardsWithMetadata.filter(
                    (leaderboard) => !leaderboard.playlistMetadata.ranked && leaderboard.playlistMetadata.standardMode
                )
                break
            default:
                filteredLeaderboardsWithMetadata = []
        }

        const aboveMd = isWidthUp("md", width)
        return (
            <Grid item xs={12} container justify="center" spacing={16}>
                <Grid item xs={12}>
                    <Typography variant="h3" align="center">Upload Leaderboards</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Tabs
                            value={this.state.selectedTab}
                            onChange={this.handleChange}
                            centered={aboveMd}
                            variant={aboveMd ? "standard" : "scrollable"}
                        >
                            {playlistTabs.map((playlist) => (
                                <Tab label={playlist} value={playlist} key={playlist}/>
                            ))}
                        </Tabs>
                        <Divider/>
                        <Grid container spacing={16} style={{paddingTop: 16}}>
                            {filteredLeaderboardsWithMetadata.map((leaderboard, i) => (
                                <Grid item xs={12} sm={6} lg={3} key={leaderboard.playlist}
                                      style={{borderLeft: (i === 0 || !aboveMd) ? undefined : "1px solid lightgrey"}}>
                                    <LeaderboardList leaderboard={leaderboard}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    private readonly handleChange = (event: React.ChangeEvent<{}>, value: PlaylistTab): void => {
        this.setState({selectedTab: value})
    }
}

export const PlaylistLeaderboardGrid = withWidth()(PlaylistLeaderboardGridComponent)
