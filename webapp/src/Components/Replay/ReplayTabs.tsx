import {Card, Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {connect} from "react-redux"
import {Replay} from "../../Models/Replay/Replay"
import {StoreState} from "../../Redux"
import {BasicStatsGrid} from "./BasicStats/BasicStatsGrid"
import {ReplayViewer} from "./ReplayViewer/ReplayViewer"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps
    & ReturnType<typeof mapStateToProps>
    & WithWidth

type tabValue = "basicStats" | "advancedStats" | "replayViewer"

interface State {
    selectedTab: tabValue
}

class ReplayTabsComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "basicStats"}
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
                    <Tab key="basicStats" label="Basic Stats" value="basicStats"/>
                    {this.props.loggedInUser && this.props.loggedInUser.alpha &&
                        [
                            <Tab key="advancedStats" label="Advanced Stats" value="advancedStats"/>,
                            <Tab key="replayViewer" label="Replay Viewer" value="replayViewer"/>
                        ]
                    }
                </Tabs>
                {this.state.selectedTab === "basicStats" &&
                    <BasicStatsGrid replay={this.props.replay} />
                }
                {this.state.selectedTab === "replayViewer" &&
                    <ReplayViewer replay={this.props.replay} />
                }
            </Card>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: tabValue) => {
        this.setState({selectedTab})
    }
}

export const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

export const ReplayTabs = withWidth()(connect(mapStateToProps)(ReplayTabsComponent))
