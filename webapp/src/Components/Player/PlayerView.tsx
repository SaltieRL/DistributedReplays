import {faCarSide, faHistory, faUserCircle, IconDefinition} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Card, CardContent, CardHeader, Divider, Grid, Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {PlayerMatchHistory} from "./Overview/MatchHistory/PlayerMatchHistory"
import {PlayerPlayStyle} from "./Overview/PlayerPlayStyle"
import {PlayerSideBar} from "./Overview/SideBar/PlayerSideBar"

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithWidth

type PlayerViewTab = "Profile" | "Playstyle" | "Match History"
const playerViewTabs = ["Profile", "Playstyle", "Match History"]

interface State {
    selectedMobileTab?: PlayerViewTab
}

class PlayerViewComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedMobileTab: "Profile"}
    }

    public render() {
        const tabToIcon: Record<PlayerViewTab, IconDefinition> = {
            "Profile": faUserCircle,
            "Playstyle": faCarSide,
            "Match History": faHistory
        }
        return (
            <>
                {isWidthUp("sm", this.props.width) ?
                    <>
                        <Grid item xs={12} sm={5} md={3} style={{maxWidth: 400}}>
                            <PlayerSideBar player={this.props.player}/>
                        </Grid>
                        <Grid item xs={12} sm={7} md={9} container spacing={24}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader title="Playstyle"/>
                                    <CardContent>
                                        <PlayerPlayStyle player={this.props.player}/>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader title="Match History"/>
                                    <CardContent>
                                        <PlayerMatchHistory player={this.props.player}/>
                                    </CardContent>
                                </Card>
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
                                <PlayerSideBar player={this.props.player}/>
                                }
                                {this.state.selectedMobileTab === "Playstyle" &&
                                <PlayerPlayStyle player={this.props.player}/>
                                }
                                {this.state.selectedMobileTab === "Match History" &&
                                <PlayerMatchHistory player={this.props.player}/>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                }
            </>
        )
    }


    private readonly handleSelectMobileTab = (event: React.ChangeEvent, selectedMobileTab: PlayerViewTab) => {
        this.setState({selectedMobileTab})
    }
}

export const PlayerView = withWidth()(PlayerViewComponent)
