import { CardHeader, Typography } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import * as React from "react"
import { Link } from "react-router-dom"
import { LEADERBOARDS_LINK } from "../../../Globals"
import { getLeaderboards } from "../../../Requests/Global"
import { playlists } from "../../../Utils/Playlists"
import { LeaderboardList } from "../../Leaderboards/LeaderboardList"
import { LeaderboardWithMetadata } from "../../Leaderboards/PlaylistLeaderboardGrid"
import CardActions from "@material-ui/core/CardActions"

interface Props {
    style: any
}

interface State {
    leaderboards?: PlaylistLeaderboard[]
}

export class Leaderboards extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getLeaderboards()
            .then((leaderboards) => this.setState({leaderboards}))
    }

    public render() {
        const {leaderboards} = this.state
        if (leaderboards !== undefined) {
            const leaderboardsWithMetadata: LeaderboardWithMetadata[] = []

            leaderboards.forEach((leaderboard) => {
                const metadata = playlists.find((playlist) => playlist.value === leaderboard.playlist)
                if (metadata !== undefined) {
                    leaderboardsWithMetadata.push({
                        playlistMetadata: metadata,
                        ...leaderboard
                    })
                }
            })

            const filteredLeaderboardsWithMetadata: LeaderboardWithMetadata[] = leaderboardsWithMetadata.filter(
                (leaderboard) => leaderboard.playlistMetadata.ranked && leaderboard.playlistMetadata.standardMode
            )
            return (
                <Card style={this.props.style}>
                    <CardHeader title={"Upload Leaderboard"}
                                subheader={"Most uploads in the last month"}/>
                    <CardContent>
                        {this.state.leaderboards ? (
                            <>
                                <LeaderboardList
                                    leaderboard={filteredLeaderboardsWithMetadata[Math.floor(Math.random() * 4)]}/>
                            </>) : null}
                    </CardContent>
                    <CardActions>
                        <Link to={LEADERBOARDS_LINK}
                                style={{textDecoration: "none"}}>
                            <Button variant="text">
                                <Typography variant="subtitle1">
                                    View Full
                                </Typography>
                            </Button>
                        </Link>
                    </CardActions>

                </Card>
            )
        }
        return null

    }
}
