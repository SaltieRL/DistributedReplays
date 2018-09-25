import {Grid} from "@material-ui/core"
import * as React from "react"
import {PlayerPlayStyle} from "./Overview/PlayStyle/PlayerPlayStyle"

interface Props {
    player: Player
}

export class PlayerDetailsView extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <Grid item xs={12}>
                    <PlayerPlayStyle player={this.props.player}/>
                </Grid>
            </>
        )
    }
}
