import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core"
import DirectionsCar from "@material-ui/icons/DirectionsCar"
import People from "@material-ui/icons/People"
import Person from "@material-ui/icons/Person"
import * as React from "react"
import {Link} from "react-router-dom"
import {PLAYER_PAGE_LINK} from "../../../../Globals"
import {getStats} from "../../../../Requests/Player/getStats"
import {roundNumberToMaxDP} from "../../../../Utils/String"
import {LoadableWrapper} from "../../../Shared/LoadableWrapper"

interface CarStat {
    carName: string
    carPercentage: number
}

interface PlayerInCommonStat {
    count: number
    id: string
    name: string
}

export interface PlayerStats {
    car: CarStat
    playersInCommon: PlayerInCommonStat[]
}

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    playerStats?: PlayerStats
    reloadSignal: boolean
}

class PlayerStatsCardComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>): void {
        if (prevProps.player.id !== this.props.player.id) {
            this.triggerReload()
        }
    }

    public render() {
        const {classes} = this.props

        return (
            <Card>
                <CardHeader title="Stats"/>
                <Divider/>
                <CardContent>
                    <LoadableWrapper load={this.getPlayerProfileStats} reloadSignal={this.state.reloadSignal}>
                        {this.state.playerStats &&
                        <>
                            <Grid container alignItems="center" justify="space-around" spacing={8}>
                                <Grid item xs={3}>
                                    <DirectionsCar/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subheading">
                                        favourite car
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} container direction="column" alignItems="center">
                                    <Grid item>
                                        <Typography align="center">
                                            {this.state.playerStats.car.carName}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography className={classes.percentage}>
                                            {roundNumberToMaxDP(this.state.playerStats.car.carPercentage * 100, 1)}%
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justify="space-around" spacing={8}>
                                <Grid item xs={3}>
                                    <People/>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="subheading">
                                        favourite players
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container alignItems="center" justify="space-around" spacing={8}>
                                <Grid item xs={12}>
                                    <List component="nav">
                                        {this.state.playerStats.playersInCommon.map((person) =>
                                            <>
                                                <Link to={PLAYER_PAGE_LINK(person.id)} style={{textDecoration: "none"}}>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <Person/>
                                                        </ListItemIcon>
                                                        <ListItemText primary={person.name}/>
                                                    </ListItem>
                                                </Link>
                                            </>
                                        )}
                                    </List>
                                </Grid>
                            </Grid>
                        </>
                        }
                    </LoadableWrapper>
                </CardContent>
            </Card>
        )
    }

    private readonly getPlayerProfileStats = (): Promise<void> => {
        return getStats(this.props.player.id)
            .then((playerStats) => this.setState({playerStats}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
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
