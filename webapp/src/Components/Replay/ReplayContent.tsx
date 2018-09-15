import {Card, CardContent, Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../Models/Replay/Replay"
import {BasicStatsGrid} from "./BasicStats/BasicStatsGrid"

interface Props {
    replay: Replay
}

type tabValue = "basicStats" | "advancedStats" | "replayViewer"

interface State {
    selectedTab: tabValue
}

export class ReplayContent extends React.PureComponent<Props, State> {
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
