import {Grid} from "@material-ui/core"
import * as React from "react"
import {PlayerMatchHistory} from "./Overview/MatchHistory/PlayerMatchHistory"
import {PlayerTendencies} from "./Overview/PlayerTendencies"

interface Props {
    player: Player
}

export class PlayerView extends React.PureComponent<Props> {
    public render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <PlayerTendencies player={this.props.player}/>
                </Grid>
                <Grid item xs={12}>
                    <PlayerMatchHistory player={this.props.player}/>
                </Grid>
            </Grid>
        )
    }
}
