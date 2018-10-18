import {
    Card,
    CardContent,
    CardHeader,
    Collapse,
    createStyles,
    Divider,
    Grid,
    IconButton,
    withStyles
} from "@material-ui/core"
import CardActions from '@material-ui/core/CardActions'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import * as React from "react"
import { getRanks } from "../../../../Requests/Player/getRanks"
import { LoadableWrapper } from "../../../Shared/LoadableWrapper"
import { PlayerPlaylistRank, PlaylistRank } from "./PlayerPlaylistRank"

export interface PlayerRanks {
    duel: PlaylistRank
    doubles: PlaylistRank
    solo: PlaylistRank
    standard: PlaylistRank
}

const playlists = ["duel", "doubles", "solo", "standard"]
const expandedPlaylists = ["hoops", "rumble", "dropshot", "snowday"]

interface OwnProps {
    player: Player
}

type Props = OwnProps

interface State {
    playerRanks: PlayerRanks,
    reloadSignal: boolean
    expanded: boolean
}

const styles = createStyles({
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto"
    },
    expandOpen: {
        transform: "rotate(180deg)"
    }
})

class PlayerRanksCardComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        const loadingRating = {
            name: "Loading...",
            rating: 0,
            rank: 0
        }
        this.state = {
            playerRanks: {
                duel: loadingRating,
                doubles: loadingRating,
                solo: loadingRating,
                standard: loadingRating
            },
            reloadSignal: false,
            expanded: false
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.player.id !== this.props.player.id) {
            this.triggerReload()
        }
    }

    public render() {
        return (
            <Card>
                <CardHeader title="Ranks"/>
                <Divider/>
                <CardContent>
                    <Grid container alignItems="center" justify="space-around" spacing={16}>
                        <LoadableWrapper load={this.getPlayerRanks} reloadSignal={this.state.reloadSignal}>
                            {playlists.map((playlist: string) => {
                                return (
                                    <Grid item xs={6} key={playlist}>
                                        <PlayerPlaylistRank playlistName={playlist}
                                                            playlistRank={this.state.playerRanks[playlist]}/>
                                    </Grid>
                                )
                            })}
                        </LoadableWrapper>
                    </Grid>
                </CardContent>
                <CardActions>
                    <IconButton
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            transform: this.state.expanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
                        }}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                    >
                        <ExpandMoreIcon/>
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Grid container alignItems="center" justify="space-around" spacing={16}>
                            {expandedPlaylists.map((playlist: string) => {
                                return (
                                    <Grid item xs={6} key={playlist}>
                                        <PlayerPlaylistRank playlistName={playlist}
                                                            playlistRank={this.state.playerRanks[playlist]}/>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }

    private readonly getPlayerRanks = (): Promise<void> => {
        return getRanks(this.props.player.id)
            .then((playerRanks) => this.setState({playerRanks}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }

    private readonly handleExpandClick = () => {
        this.setState((state) => ({expanded: !state.expanded}))
    }
}

export const PlayerRanksCard = withStyles(styles)(PlayerRanksCardComponent)
