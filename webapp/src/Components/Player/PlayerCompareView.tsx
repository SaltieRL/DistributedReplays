import {Grid, TextField} from "@material-ui/core"
import * as React from "react"
import {PlayStyleResponse} from "../../Models/Player/PlayStyle"

interface Props {
    ids: string[]
    players: Player[]
    playerPlayStyles: PlayStyleResponse[]
}

export class PlayerCompareView extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <Grid item xs={12}>
                    <TextField/>
                </Grid>
            </>
        )
    }
}
