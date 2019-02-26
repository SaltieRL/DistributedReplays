import { CardContent, Divider, Grid } from "@material-ui/core"
import * as React from "react"
import { Replay, TeamStatsSubcategory } from "../../../../Models"
import { TeamStatsCharts } from "./TeamStatsCharts"
import { TeamStatsTabs } from "./TeamStatsTabs"

interface Props {
    replay: Replay
    explanations: Record<string, any> | undefined
}

interface State {
    selectedTab: TeamStatsSubcategory
}

export class TeamStatsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: TeamStatsSubcategory.POSITIONING}
    }

    public render() {
        return (
            <>
                <Divider/>
                <TeamStatsTabs selectedTab={this.state.selectedTab} handleChange={this.handleSelectTab}/>
                <CardContent>
                    <Grid container spacing={32}>
                        <TeamStatsCharts replay={this.props.replay} selectedTab={this.state.selectedTab}
                                         explanations={this.props.explanations}/>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: TeamStatsSubcategory) => {
        this.setState({selectedTab})
    }
}
