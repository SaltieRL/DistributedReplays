import { faCarSide, faHistory, faUserCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card, CardContent, Divider, Grid, Tab, Tabs, withWidth } from "@material-ui/core"
import { isWidthDown, isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"
import { OverviewMatchHistory } from "./Overview/MatchHistory/OverviewMatchHistory"
import { PlayerMatchHistoryCard } from "./Overview/MatchHistory/PlayerMatchHistoryCard"
import { PlayerPlayStyle } from "./Overview/PlayStyle/PlayerPlayStyle"
import { PlayerPlayStyleCard } from "./Overview/PlayStyle/PlayerPlayStyleCard"
import { PlayStyleActions } from "./Overview/PlayStyle/PlayStyleActions"
import { PlayerSideBar } from "./Overview/SideBar/PlayerSideBar"

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithWidth

type PlayerViewTab = "Profile" | "Playstyle" | "Match History"
const playerViewTabs: PlayerViewTab[] = ["Profile", "Playstyle", "Match History"]

interface State {
    selectedMobileTab?: PlayerViewTab
    playlist: number
    winLossMode: boolean
}

class PlayerOverviewComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedMobileTab: "Profile", playlist: 13, winLossMode: false}
    }

    public render() {
        const tabToIcon: Record<PlayerViewTab, IconDefinition> = {
            "Profile": faUserCircle,
            "Playstyle": faCarSide,
            "Match History": faHistory
        }

        const playerSideBar = <PlayerSideBar player={this.props.player}/>
        const playerPlayStyle = (
            <PlayerPlayStyle player={this.props.player} playlist={this.state.playlist}
                             winLossMode={this.state.winLossMode}/>
        )
        const playerMatchHistory = (
            <OverviewMatchHistory
                player={this.props.player}
                useBoxScore={isWidthDown("sm", this.props.width)}
            />
        )

        return (
            <>
                {isWidthUp("md", this.props.width) ?
                    <>
                        <Grid item xs={5} md={3}>
                            {playerSideBar}
                        </Grid>
                        <Grid item xs={7} md={9} container spacing={24}>
                            <Grid item xs={12}>
                                <PlayerPlayStyleCard
                                    player={this.props.player}
                                    playlist={this.state.playlist}
                                    winLossMode={this.state.winLossMode}
                                    handlePlaylistChange={this.handlePlaylistChange}
                                    handleWinsLossesChange={this.handleWinsLossesChange}
                                >
                                    {playerPlayStyle}
                                </PlayerPlayStyleCard>
                            </Grid>
                            <Grid item xs={12}>
                                <PlayerMatchHistoryCard player={this.props.player}>
                                    {playerMatchHistory}
                                </PlayerMatchHistoryCard>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <Grid item xs={12}>
                        <Card>
                            <Tabs value={this.state.selectedMobileTab}
                                  onChange={this.handleSelectMobileTab}
                                  centered
                            >
                                {playerViewTabs.map((playerViewTab: PlayerViewTab) =>
                                    <Tab label={playerViewTab} value={playerViewTab} key={playerViewTab}
                                         icon={<FontAwesomeIcon icon={tabToIcon[playerViewTab]}/>}/>
                                )}
                            </Tabs>
                            <Divider/>
                            <CardContent>
                                {this.state.selectedMobileTab === "Profile" &&
                                playerSideBar
                                }
                                {this.state.selectedMobileTab === "Playstyle" &&
                                <>
                                    <div style={{width: "100%", textAlign: "right"}}>
                                        <PlayStyleActions
                                            player={this.props.player}
                                            playlist={this.state.playlist}
                                            winLossMode={this.state.winLossMode}
                                            handlePlaylistChange={this.handlePlaylistChange}
                                            handleWinsLossesChange={this.handleWinsLossesChange}
                                        />
                                    </div>
                                    {playerPlayStyle}
                                </>
                                }
                                {this.state.selectedMobileTab === "Match History" &&
                                playerMatchHistory
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                }
            </>
        )
    }

    private readonly handleSelectMobileTab = (_: React.ChangeEvent<{}>, selectedMobileTab: PlayerViewTab) => {
        this.setState({selectedMobileTab})
    }

    private readonly handlePlaylistChange = (playlist: number) => {
        this.setState({playlist})
    }

    private readonly handleWinsLossesChange = (winLossMode: boolean) => {
        this.setState({winLossMode})
    }
}

export const PlayerOverview = withWidth()(PlayerOverviewComponent)
