import {Grid} from "@material-ui/core"
import * as React from "react"
import {PlayerProfile} from "./PlayerProfile"
import {PlayerRanksCard} from "./PlayerRanksCard"

interface Props {
    player: Player
}

export class PlayerSideBar extends React.PureComponent<Props> {
    public render() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <PlayerProfile player={this.props.player} />
                </Grid>
                <Grid item xs={12}>
                    {/*<PlayerStatsCard player={this.props.player} />*/}
                </Grid>
                <Grid item xs={12}>
                    <PlayerRanksCard player={this.props.player} />
                </Grid>
            </Grid>
        )
    }
}
