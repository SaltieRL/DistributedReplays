import {createStyles, Grid, Theme, Tooltip, Typography, withStyles, WithStyles} from "@material-ui/core"
import {Info} from "@material-ui/icons"
import * as React from "react"
import {getGlobalStats} from "../../Requests/Global"
import {GlobalStatsChart} from "../GlobalStatsChart"
import {BasePage} from "./BasePage"

type Props = WithStyles<typeof styles>

interface State {
    globalStats?: GlobalStatsGraph[]
}

class GlobalStatsPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getGlobalStats()
            .then((globalStats) => this.setState({globalStats}))
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={16} alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <Typography variant="title" align="center">
                            Distributions
                            <Tooltip title="Click legend items to toggle visibility of that playlist">
                                <Info className={this.props.classes.infoIcon}/>
                            </Tooltip>
                        </Typography>
                    </Grid>
                    {this.state.globalStats && this.state.globalStats.map((globalStatsGraph) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={globalStatsGraph.name}>
                                <Typography variant="subheading">
                                    {globalStatsGraph.name}
                                </Typography>
                                <GlobalStatsChart graph={globalStatsGraph}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </BasePage>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    infoIcon: {
        verticalAlign: "middle",
        marginLeft: theme.spacing.unit,
        marginTop: theme.spacing.unit
    }
})

export const GlobalStatsPage = withStyles(styles)(GlobalStatsPageComponent)
