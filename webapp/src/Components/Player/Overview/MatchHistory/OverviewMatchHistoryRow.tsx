import {createStyles, ExpansionPanel, ExpansionPanelDetails, WithStyles, withStyles} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../../Models"
import {ReplayBoxScore} from "../../../Replay/ReplayBoxScore"
import {ReplayChart} from "../../../Replay/ReplayChart"
import {ReplayExpansionPanelSummary} from "./ReplayExpansionPanelSummary"

const styles = createStyles({
    panelDetails: {
        overflowX: "auto",
        maxWidth: "95vw",
        margin: "auto"
    }
})

interface OwnProps {
    replay: Replay
    player: Player
    useBoxScore?: boolean
}

type Props = OwnProps & WithStyles<typeof styles>

class OverviewMatchHistoryRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes} = this.props

        const {replay, player} = this.props

        return (
            <ExpansionPanel TransitionProps={{unmountOnExit: true}}>
                <ReplayExpansionPanelSummary replay={replay} player={player} />
                <ExpansionPanelDetails className={classes.panelDetails}>
                    {!this.props.useBoxScore ? (
                        <ReplayChart replay={this.props.replay} />
                    ) : (
                        <ReplayBoxScore replay={this.props.replay} player={this.props.player} />
                    )}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export const OverviewMatchHistoryRow = withStyles(styles)(OverviewMatchHistoryRowComponent)
