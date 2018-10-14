import {CardContent, Divider, Grid} from "@material-ui/core"
import * as React from "react"
import {BasicStatsSubcategory} from "../../../../Models/ChartData"
import {Replay} from "../../../../Models/Replay/Replay"
import {PlayerStatsCharts} from "./BasicStatsCharts"
import {PlayerStatsTabs} from "./BasicStatsTabs"

interface Props {
    replay: Replay
}

interface State {
    selectedTab: BasicStatsSubcategory
}

export class PlayerStatsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Hits"}
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

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: BasicStatsSubcategory) => {
        this.setState({selectedTab})
    }
}
