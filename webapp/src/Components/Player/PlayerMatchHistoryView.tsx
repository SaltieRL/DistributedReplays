import {Typography} from "@material-ui/core"
import * as React from "react"
import {PlayerMatchHistory} from "./Overview/MatchHistory/PlayerMatchHistory"

interface Props {
    player: Player
}

export class PlayerMatchHistoryView extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <Typography variant="title">
                    {`${this.props.player.name}'s Match History`}
                </Typography>
                <PlayerMatchHistory player={this.props.player}/>
            </>
        )
    }
}
