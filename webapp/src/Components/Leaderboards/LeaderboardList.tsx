import { List, Typography } from "@material-ui/core"
import * as React from "react"
import { LeaderListItem } from "./LeaderListItem"
import { LeaderboardWithMetadata } from "./PlaylistLeaderboardGrid"

interface Props {
    leaderboard: LeaderboardWithMetadata
}

export class LeaderboardList extends React.PureComponent<Props> {
    public render() {
        const {leaderboard} = this.props
        return (
            <div key={leaderboard.playlist} style={{maxWidth: 400, margin: "auto"}}>
                <Typography variant="h5" align="center">{leaderboard.playlistMetadata.name}</Typography>
                <List>
                    {leaderboard.leaders.month.map((leader, i) => (
                        <LeaderListItem leader={leader} key={i}/>
                    ))}
                </List>
            </div>
        )
    }
}
