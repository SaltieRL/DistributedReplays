import {Grid, Typography} from "@material-ui/core"
import * as React from "react"

export interface PlaylistRank {
    name: string
    rank: number
    rating: number
}

interface Props {
    playlistName: string
    playlistRank: PlaylistRank
}

export class PlayerPlaylistRank extends React.PureComponent<Props> {
    public render() {
        return (
            <Grid container direction="column" justify="center">
                <Typography variant="h6" align="center">
                    {this.props.playlistName}
                </Typography>
                <img
                    alt=""
                    style={{width: 64, height: 64, margin: "auto"}}
                    src={`${window.location.origin}/ranks/${this.props.playlistRank.rank}.png`}
                />
                <Typography align="center">{this.props.playlistRank.name}</Typography>
                <Typography align="center">rating: {this.props.playlistRank.rating}</Typography>
            </Grid>
        )
    }
}
