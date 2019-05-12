import { CardContent, Divider, Grid } from "@material-ui/core"
import * as React from "react"
import { PlayerStatsSubcategory, Replay } from "../../../../Models"
import { PlayerStatsCharts } from "./PlayerStatsCharts"
import { PlayerStatsTabs } from "./PlayerStatsTabs"

interface Props {
    replay: Replay
    explanations: Record<string, any> | undefined
}

interface State {
    selectedTab: PlayerStatsSubcategory
}

export class PlayerStatsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: PlayerStatsSubcategory.HITS}
    }

    public render() {
        return (
            <>
                <Divider/>
                <PlayerStatsTabs selectedTab={this.state.selectedTab} handleChange={this.handleSelectTab}/>
                <CardContent>
                    <Grid container spacing={32}>
                        <PlayerStatsCharts replay={this.props.replay} selectedTab={this.state.selectedTab}
                                           explanations={this.props.explanations}/>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: PlayerStatsSubcategory) => {
        this.setState({selectedTab})
    }
}
