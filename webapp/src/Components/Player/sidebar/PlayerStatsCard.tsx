import {faChartBar} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Divider,
    Grid,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core"
import * as React from "react"

interface CarStat {
    carName: string
    carPercentage: number
}

interface PlayerStats {
    car: CarStat
}

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    playerStats?: PlayerStats
}

class PlayerStatsCardComponent extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        this.setState({
            playerStats: this.getStats()
        })
    }

    public render() {
        const {classes} = this.props

        return (
            <Card>
                <CardHeader title="Stats"/>
                <Divider/>
                <CardContent>
                    {this.state.playerStats &&
                    <Grid container alignItems="center" justify="space-around" spacing={16}>
                        <Grid item xs="auto">
                            <FontAwesomeIcon icon={faChartBar}/>
                        </Grid>
                        <Grid item xs="auto">
                            <Typography variant="subheading">
                                favourite car
                            </Typography>
                        </Grid>
                        <Grid item xs={3} container direction="column" alignItems="center">
                            <Grid item>
                                <Typography>
                                    {this.state.playerStats.car.carName}
                                </Typography>
                                <div className={classes.percentage}>
                                    {this.state.playerStats.car.carPercentage}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    }
                </CardContent>
            </Card>
        )
    }

    private readonly getStats = (): PlayerStats => {
        // TODO: Replace with actual query.
        return {
            car: {
                carName: "octane",
                carPercentage: 0.8
            }
        }
    }
}

const styles = createStyles({
    percentage: {
        padding: 5,
        textAlign: "center",
        borderTop: "1px solid rgb(70, 70, 70)",
        borderBottom: "1px solid rgb(70, 70, 70)",
        backgroundColor: "rgb(218, 248, 213)"
    }
})

export const PlayerStatsCard = withStyles(styles)(PlayerStatsCardComponent)
