import {
    Card,
    CardContent,
    CardHeader,
    createStyles, Dialog, DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core"
import CardTravel from "@material-ui/icons/CardTravel"
import DirectionsCar from "@material-ui/icons/DirectionsCar"
import OpenInBrowser from "@material-ui/icons/OpenInBrowser"
import People from "@material-ui/icons/People"
import Person from "@material-ui/icons/Person"
import VideogameAsset from "@material-ui/icons/VideogameAsset"
import * as React from "react"
import { Link } from "react-router-dom"
import { PLAYER_PAGE_LINK } from "../../../../Globals"
import { getStats } from "../../../../Requests/Player/getStats"
import { roundNumberToMaxDP } from "../../../../Utils/String"
import { LoadoutDisplay } from "../../../Replay/ReplayTeamCard/LoadoutDisplay"
import { LoadableWrapper } from "../../../Shared/LoadableWrapper"

const styles = createStyles({
    percentage: {
        padding: 5,
        textAlign: "center",
        borderTop: "1px solid rgb(70, 70, 70)",
        borderBottom: "1px solid rgb(70, 70, 70)"
    }
})

interface CarStat {
    carName: string
    carPercentage: number
}

interface PlayerInCommonStat {
    count: number
    id: string
    name: string
    avatar: string
}

export interface PlayerStats {
    car: CarStat
    playersInCommon: PlayerInCommonStat[]
    loadout: Loadout
}

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    playerStats?: PlayerStats
    reloadSignal: boolean
    loadoutOpen: boolean
}

class PlayerStatsCardComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false, loadoutOpen: false}
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
                                    <Typography> <DirectionsCar/> </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1">
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
                                    <Typography> <CardTravel/> </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1">
                                        loadout
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} container direction="column" alignItems="center">
                                    <IconButton onClick={this.handleShowLoadout}>
                                        <OpenInBrowser/>
                                    </IconButton>
                                </Grid>
                                <Dialog open={this.state.loadoutOpen} onClose={this.handleCloseLoadout}>
                                    <DialogTitle>Loadout</DialogTitle>
                                    <LoadoutDisplay loadout={this.state.playerStats.loadout}/>
                                </Dialog>
                            </Grid>

                            <Grid container alignItems="center" justify="space-around" spacing={8}>
                                <Grid item xs={3}>
                                    <Typography> <People/> </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="subtitle1">
                                        plays with
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container alignItems="center" justify="space-around" spacing={8}>
                                <Grid item xs={12}>
                                    <List component="nav">
                                        {this.state.playerStats.playersInCommon.map((person) =>
                                            <Link to={PLAYER_PAGE_LINK(person.id)} style={{textDecoration: "none"}}
                                                  key={person.id}>
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        {person.avatar ?
                                                            <img alt={`${person.name}'s avatar`} height={"30px"}
                                                                 src={person.avatar}/> : <Person/>}
                                                    </ListItemIcon>
                                                    <ListItemText primary={person.name}/>
                                                    <ListItemSecondaryAction>
                                                        <Tooltip title={"Search games played together"}>
                                                            <Link style={{textDecoration: "none", marginLeft: "auto"}}
                                                                  to={`/search/replays?player_ids=${person.id}` +
                                                                  `&player_ids=${this.props.player.id}`}>
                                                                <IconButton><VideogameAsset/></IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </Link>
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

    private readonly handleShowLoadout = () => {
        this.setState({loadoutOpen: true})
    }
    private readonly handleCloseLoadout = () => {
        this.setState({loadoutOpen: false})
    }
}

export const PlayerStatsCard = withStyles(styles)(PlayerStatsCardComponent)
