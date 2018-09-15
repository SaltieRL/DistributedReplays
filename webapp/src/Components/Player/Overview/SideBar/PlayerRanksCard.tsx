import {Card, CardContent, CardHeader, Divider, Grid} from "@material-ui/core"
import * as React from "react"
import {getRanks} from "../../../../Requests/Player"
import {PlayerPlaylistRank, PlaylistRank} from "./PlayerPlaylistRank"

export interface PlayerRanks {
    duel: PlaylistRank
    doubles: PlaylistRank
    solo: PlaylistRank
    standard: PlaylistRank
}

const playlists = ["duel", "doubles", "solo", "standard"]

interface OwnProps {
    player: Player
}

type Props = OwnProps

interface State {
    playerRanks: PlayerRanks
}

export class PlayerRanksCard extends React.PureComponent<Props, State> {
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
            }
        }
    }

    public componentDidMount() {
        this.getPlayerRanks()
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.player.id !== this.props.player.id) {
            this.getPlayerRanks()
        }
    }

    public render() {
        return (
            <Card>
                <CardHeader title="Ranks"/>
                <Divider/>
                <CardContent>
                    <Grid container alignItems="center" justify="space-around" spacing={16}>
                        {playlists.map((playlist: string) => {
                            return (
                                <Grid item xs={6} key={playlist}>
                                    <PlayerPlaylistRank playlistName={playlist}
                                                        playlistRank={this.state.playerRanks[playlist]}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    private readonly getPlayerRanks = () => {
        getRanks(this.props.player.id)
            .then((playerRanks) => this.setState({playerRanks}))
    }
}
