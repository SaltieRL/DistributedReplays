import { CardContent, Grid } from "@material-ui/core"
import * as React from "react"
import { BasicStat, PlayerStatsSubcategory, Replay } from "../../../Models"
import { PlayerStatsTabs } from "../../Replay/BasicStats/PlayerStats/PlayerStatsTabs"
import { ReplaysGroupCharts } from "./ReplaysGroupCharts"

interface OwnProps {
    replays: Replay[]
}

type Props = OwnProps

interface State {
    basicStats?: BasicStat[]
    selectedTab: PlayerStatsSubcategory
}

export class ReplaysGroupChartsWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { selectedTab: PlayerStatsSubcategory.HITS }
    }

    public render() {
        return (
            <>
                <PlayerStatsTabs selectedTab={this.state.selectedTab} handleChange={this.handleSelectTab}/>
                <CardContent>
                    <Grid container spacing={32} justify="center">
                        <ReplaysGroupCharts replays={this.props.replays} selectedTab={this.state.selectedTab}/>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: PlayerStatsSubcategory) => {
        this.setState({ selectedTab })
    }
}
