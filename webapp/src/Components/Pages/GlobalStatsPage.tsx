import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Grid,
    Theme,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core"
import * as React from "react"
import { getGlobalStats } from "../../Requests/Global"
import { GlobalStatsChart } from "../GlobalStatsChart"
import { IconTooltip } from "../Shared/IconTooltip"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

type Props = WithStyles<typeof styles>

interface State {
    globalStats?: GlobalStatsGraph[]
}

class GlobalStatsPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <BasePage backgroundImage={"/splash.png"}>
                <Grid container spacing={16} alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <Typography variant="title" align="center">
                            Distributions
                            <IconTooltip tooltip="Click legend items to toggle visibility of that playlist"/>
                        </Typography>
                    </Grid>
                    <LoadableWrapper load={this.getStats}>
                        {this.state.globalStats && this.state.globalStats.map((globalStatsGraph) => {
                            return (
                                <Grid item xs={12} sm={6} md={4} key={globalStatsGraph.name}>
                                    <Card>
                                        <CardHeader title={globalStatsGraph.name}
                                                    titleTypographyProps={{align: "center"}}/>
                                        <CardContent>
                                            <GlobalStatsChart graph={globalStatsGraph}/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </LoadableWrapper>
                </Grid>
            </BasePage>
        )
    }

    private readonly getStats = (): Promise<void> => {
        return getGlobalStats()
            .then((globalStats) => this.setState({globalStats}))
    }
}

const styles = (theme: Theme) => createStyles({
    infoIcon: {
        verticalAlign: "middle",
        marginLeft: theme.spacing.unit,
        marginTop: -4
    }
})

export const GlobalStatsPage = withStyles(styles)(GlobalStatsPageComponent)
