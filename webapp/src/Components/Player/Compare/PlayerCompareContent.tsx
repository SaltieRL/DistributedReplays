import {Divider, Grid, Paper, Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {PlayerComparePlayStyleCharts} from "./PlayStyle/PlayerComparePlayStyleCharts"
import {PlayerProgressionCharts} from "./Progression/PlayerProgressionCharts"

interface Props {
    players: Player[]
}

type PlayerCompareTab = "Current" | "Progression"

interface State {
    selectedTab: PlayerCompareTab
}

export class PlayerCompareContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Current"}
    }

    public render() {
        return (
            <Paper>
                <Tabs value={this.state.selectedTab}
                      onChange={this.handleSelectTab}
                      centered
                >
                    <Tab label="Current" value="Current"/>
                    <Tab label="Progression" value="Progression"/>
                </Tabs>
                <Divider/>
                {this.state.selectedTab === "Current" ?
                    <div style={{padding: 16, paddingBottom: 48}}>
                        <Grid container spacing={32}>
                            <PlayerComparePlayStyleCharts players={this.props.players}/>
                        </Grid>
                    </div>
                    :
                    <div style={{padding: 16, paddingBottom: 48}}>
                        <Grid container spacing={32} justify="center">
                            <PlayerProgressionCharts players={this.props.players}/>
                        </Grid>
                    </div>
                }
            </Paper>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: PlayerCompareTab) => {
        this.setState({selectedTab})
    }
}
