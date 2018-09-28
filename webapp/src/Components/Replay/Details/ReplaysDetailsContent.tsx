import {Divider, Grid, Paper, Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../Models/Replay/Replay"
import {ReplaysDetailsCharts} from "./ReplaysDetailsCharts"

interface Props {
    replays: Replay[]
}

type ReplaysDetailsTab = "Table" | "Chart"

interface State {
    selectedTab: ReplaysDetailsTab
}

export class ReplaysDetailsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Chart"}
    }

    public render() {
        return (
            <Paper>
                <Tabs value={this.state.selectedTab}
                      onChange={this.handleSelectTab}
                      centered
                >
                    <Tab label="Table" value="Table"/>
                    <Tab label="Charts" value="Charts"/>
                </Tabs>
                <Divider/>
                {this.state.selectedTab === "Table" ?
                    <div style={{padding: 16, paddingBottom: 48}}>
                        <Grid container spacing={32}>
                            Table
                        </Grid>
                    </div>
                    :
                    <div style={{padding: 16, paddingBottom: 48}}>
                        <Grid container spacing={32} justify="center">
                            <ReplaysDetailsCharts replays={this.props.replays} />
                        </Grid>
                    </div>
                }
            </Paper>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: ReplaysDetailsTab) => {
        this.setState({selectedTab})
    }
}
