import { createStyles, Divider, Grid, WithStyles, withStyles } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { KickoffMapWrapper } from "./KickoffMapWrapper"

const styles = createStyles({
    kickoffTitle: {
        padding: 10,
        marginBottom: 10
    }
})

interface OwnProps {
    replay: Replay
    kickoffData: any
    kickoffIndex: number
    players: any
}

type Props = OwnProps
    & WithStyles<typeof styles>

class KickoffContentComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <Divider/>
                <Grid container spacing={2}>
                    <Grid item xs={12} container justify="center">
                        <KickoffMapWrapper key={this.props.kickoffIndex}
                                           kickoffIndex={this.props.kickoffIndex}
                                           kickoffData={this.props.kickoffData}
                                           replay={this.props.replay}
                                           players={this.props.players}/>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export const KickoffContent = withStyles(styles)(KickoffContentComponent)
