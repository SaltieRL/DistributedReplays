import {Card, Divider, Grid, Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../Models/Replay/Replay"
import {ReplaysDetailsChartsWrapper} from "./Charts/ReplaysDetailsChartsWrapper"

interface Props {
    replays: Replay[]
}

type ReplaysDetailsTab = "Table" | "Charts"

interface State {
    selectedTab: ReplaysDetailsTab
}

export class ReplaysDetailsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Charts"}
    }

    public render() {
        return (
            <Card square style={{width: "100%"}}>
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
                    <ReplaysDetailsChartsWrapper replays={this.props.replays}/>
                }
            </Card>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: ReplaysDetailsTab) => {
        this.setState({selectedTab})
    }
}
