import {Grid, Tooltip, Typography} from "@material-ui/core"
import {ArrowDownward, ArrowUpward} from "@material-ui/icons"
import * as React from "react"

export interface PlaylistRank {
    name: string
    rank: number
    rating: number
    streak: number
}

interface Props {
    playlistName: string
    playlistRank: PlaylistRank
}

export class PlayerPlaylistRank extends React.PureComponent<Props> {
    public render() {
        const {streak} = this.props.playlistRank
        return (
            <Grid container direction="column" justify="center">
                <Typography variant="h6" align="center">
                    {this.props.playlistName}
                </Typography>
                <div style={{margin: "auto", position: "relative"}}>
                    <img
                        alt=""
                        style={{width: 64, height: 64, margin: "auto"}}
                        src={`${window.location.origin}/ranks/${this.props.playlistRank.rank}.png`}
                    />
                    {Math.abs(streak) > 1 && (
                        <Tooltip title={(streak > 0 ? "Win" : "Loss") + " streak: " + Math.abs(streak)}>
                            <Typography
                                style={{
                                    position: "absolute",
                                    top: "5px",
                                    left: "65%",
                                    width: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    fontWeight: 800,
                                    color: streak > 0 ? "#ff5722" : "#2196f3"
                                }}
                            >
                                {streak > 0 ? <ArrowUpward /> : <ArrowDownward />}
                                <span>{Math.abs(streak)}</span>
                            </Typography>
                        </Tooltip>
                    )}
                </div>
                <Typography align="center">{this.props.playlistRank.name}</Typography>
                <Typography align="center">rating: {this.props.playlistRank.rating}</Typography>
            </Grid>
        )
    }
}
