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
import DirectionsCar from "@material-ui/icons/DirectionsCar"
import * as React from "react"
import {getStats} from "../../../../Requests/Player"
import {convertNumberToMaxDP} from "../../../../Utils/String"

interface CarStat {
    carName: string
    carPercentage: number
}

export interface PlayerStats {
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
        this.getPlayerProfileStats()
    }

    public componentDidUpdate(prevProps: Readonly<Props>): void {
        if (prevProps.player.id !== this.props.player.id) {
            this.getPlayerProfileStats()
        }
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
                            <DirectionsCar/>
                        </Grid>
                        <Grid item xs="auto">
                            <Typography variant="subheading">
                                favourite car
                            </Typography>
                        </Grid>
                        <Grid item xs={3} container direction="column" alignItems="center">
                            <Grid item>
                                <Typography align="center">
                                    {this.state.playerStats.car.carName}
                                </Typography>
                                <Typography className={classes.percentage}>
                                    {convertNumberToMaxDP(this.state.playerStats.car.carPercentage * 100, 1)}%
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    }
                </CardContent>
            </Card>
        )
    }

    private readonly getPlayerProfileStats = () => {
        getStats(this.props.player.id)
            .then((playerStats) => this.setState({playerStats}))
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
