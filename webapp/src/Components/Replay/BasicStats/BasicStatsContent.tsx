import { CardContent, Divider, Grid } from "@material-ui/core"
import * as React from "react"
import { BasicStatsSubcategory, Replay } from "src/Models"
import { BasicStatsCharts } from "./BasicStatsCharts"
import { BasicStatsTabs } from "./BasicStatsTabs"

interface Props {
    replay: Replay
}

interface State {
    selectedTab: BasicStatsSubcategory
}

export class BasicStatsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { selectedTab: "Hits" }
    }

    public render() {
        return (
            <>
                <Divider />
                <BasicStatsTabs selectedTab={this.state.selectedTab} handleChange={this.handleSelectTab} />
                <CardContent>
                    <Grid container spacing={32}>
                        <BasicStatsCharts replay={this.props.replay} selectedTab={this.state.selectedTab} />
                    </Grid>
                </CardContent>
            </>
        )
    }

    private readonly handleSelectTab = (event: React.ChangeEvent, selectedTab: BasicStatsSubcategory) => {
        this.setState({ selectedTab })
    }
}
