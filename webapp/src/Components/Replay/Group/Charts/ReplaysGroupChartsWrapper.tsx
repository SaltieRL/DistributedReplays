import {CardContent, Grid} from "@material-ui/core"
import * as React from "react"
import {BasicStat, BasicStatsSubcategory} from "../../../../Models/ChartData"
import {Replay} from "../../../../Models/Replay/Replay"
import {BasicStatsTabs} from "../../BasicStats/BasicStatsTabs"
import {ReplayGroupCharts} from "./ReplayGroupCharts"

interface OwnProps {
    replays: Replay[]
}

type Props = OwnProps

interface State {
    basicStats?: BasicStat[]
    selectedTab: BasicStatsSubcategory
}

export class ReplaysGroupChartsWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Hits"}
    }

    public render() {
        return (
            <>
                <BasicStatsTabs selectedTab={this.state.selectedTab} handleChange={this.handleSelectTab}/>
                <CardContent>
                    <Grid container spacing={32} justify="center">
                        <ReplayGroupCharts replays={this.props.replays} selectedTab={this.state.selectedTab}/>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: BasicStatsSubcategory) => {
        this.setState({selectedTab})
    }
}
