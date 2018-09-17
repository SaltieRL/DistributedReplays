import {Card, CardContent, Tab, Tabs, withWidth} from "@material-ui/core"
import {isWidthDown, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {Replay} from "../../Models/Replay/Replay"
import {BasicStatsGrid} from "./BasicStats/BasicStatsGrid"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps
    & WithWidth

type tabValue = "basicStats" | "advancedStats" | "replayViewer"

interface State {
    selectedTab: tabValue
}

class ReplayContentComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "basicStats"}
    }

    public render() {
        return (
            <Card square style={{width: "100%"}}>
                <Tabs value={this.state.selectedTab}
                      onChange={this.handleSelectTab}
                      centered
                      scrollable={isWidthDown("sm", this.props.width)}
                >
                    <Tab label="Basic Stats" value="basicStats"/>
                    <Tab label="Advanced Stats" value="advancedStats"/>
                    <Tab label="Replay Viewer" value="replayViewer"/>
                </Tabs>
                <CardContent>
                    {this.state.selectedTab === "basicStats" &&
                    <BasicStatsGrid replay={this.props.replay}/>
                    }
                    Placeholder
                </CardContent>
            </Card>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: tabValue) => {
        this.setState({selectedTab})
    }
}


export const ReplayContent = withWidth()(ReplayContentComponent)
