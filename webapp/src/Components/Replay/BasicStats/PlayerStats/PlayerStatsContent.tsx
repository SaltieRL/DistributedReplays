import { CardContent, Divider, Grid } from "@material-ui/core"
import * as React from "react"
import { PlayerStatsSubcategory } from "src/Models/ChartData"
import { Replay } from "src/Models/Replay/Replay"
import { PlayerStatsCharts } from "./PlayerStatsCharts"
import { PlayerStatsTabs } from "./PlayerStatsTabs"

interface Props {
    replay: Replay
}

interface State {
    selectedTab: PlayerStatsSubcategory
}

export class PlayerStatsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { selectedTab: PlayerStatsSubcategory.HITS }
    }

    public render() {
        return (
            <>
                <Divider/>
                <PlayerStatsTabs selectedTab={this.state.selectedTab} handleChange={this.handleSelectTab}/>
                <CardContent>
                    <Grid container spacing={32}>
                        <PlayerStatsCharts replay={this.props.replay} selectedTab={this.state.selectedTab}/>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: PlayerStatsSubcategory) => {
        this.setState({ selectedTab })
    }
}
