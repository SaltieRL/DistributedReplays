import {Card, Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {connect} from "react-redux"
import {Replay} from "../../Models/Replay/Replay"
import {StoreState} from "../../Redux"
import {PlayerStatsContent} from "./BasicStats/PlayerStats/PlayerStatsContent"
import {ReplayViewer} from "./ReplayViewer/ReplayViewer"
import {TeamStatsContent} from "./BasicStats/TeamStats/TeamStatsContent"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps
    & ReturnType<typeof mapStateToProps>
    & WithWidth

type ReplayTab = "playerStats" | "teamStats" | "advancedStats" | "replayViewer"

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

        return (
            <Card square style={{width: "100%"}}>
                <Tabs value={this.state.selectedTab}
                      onChange={this.handleSelectTab}
                      centered={!isWidthSm}
                      scrollable={isWidthSm}
                >
                    <Tab key="basicStats" label="Player Stats" value="playerStats"/>
                    {this.props.loggedInUser && this.props.loggedInUser.beta &&
                        <Tab key="teamStats" label="Team Stats" value="teamStats"/>
                    }
                    {this.props.loggedInUser && this.props.loggedInUser.alpha &&
                        [
                            <Tab key="advancedStats" label="Advanced Stats" value="advancedStats"/>,
                            <Tab key="replayViewer" label="Replay Viewer" value="replayViewer"/>
                        ]
                    }
                </Tabs>
                {this.state.selectedTab === "playerStats" &&
                <PlayerStatsContent replay={this.props.replay}/>
                }
                {this.state.selectedTab === "teamStats" &&
                <TeamStatsContent replay={this.props.replay}/>
                }
                {this.state.selectedTab === "replayViewer" &&
                    <ReplayViewer replay={this.props.replay} />
                }
            </Card>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: ReplayTab) => {
        this.setState({selectedTab})
    }
}

export const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

export const ReplayTabs = withWidth()(connect(mapStateToProps)(ReplayTabsComponent))
