import {ExpansionPanel, ExpansionPanelSummary, Grid, Typography} from "@material-ui/core"
import {ExpandMore} from "@material-ui/icons"
import * as React from "react"
import {getColouredGameScore, Replay} from "../../../Models/Replay/Replay"

interface Props {
    replay: Replay
}


export class MatchHistoryRow extends React.PureComponent<Props> {
    public render() {
        const {replay} = this.props
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={ExpandMore}>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant="subheading">
                                {replay.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="subheading">
                                {replay.date.format("DD/MM/YYYY")}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="subheading">
                                {replay.gameMode}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subheading">
                                {getColouredGameScore(replay)}
                                {/*{`${replay.score.team0Score} - ${replay.score.team1Score}`}*/}
                            </Typography>
                        </Grid>
                    </Grid>
                </ExpansionPanelSummary>
            </ExpansionPanel>
        )
    }
}
