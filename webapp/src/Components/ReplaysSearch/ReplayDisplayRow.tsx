import {
    Checkbox,
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    Theme,
    WithStyles,
    withStyles,
    withWidth
} from "@material-ui/core"
import {WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {connect} from "react-redux"
import {Replay} from "../../Models"
import {StoreState} from "../../Redux"
import {ReplayExpansionPanelSummary} from "../Player/Overview/MatchHistory/ReplayExpansionPanelSummary"
import {ReplayBoxScore} from "../Replay/ReplayBoxScore"
import {ReplayChart} from "../Replay/ReplayChart"
import {TagDialogWrapper} from "../Shared/Tag/TagDialogWrapper"
import {VisibilityToggle} from "./VisibilityToggle."

const styles = (theme: Theme) =>
    createStyles({
        panelDetails: {
            overflowX: "auto",
            maxWidth: "95vw",
            margin: "auto"
        },
        checkboxPadding: {
            padding: 0,
            paddingLeft: 8,
            paddingRight: 8
        }
    })

interface SelectProps {
    selected: boolean
    handleSelectChange: (selected: boolean) => void
}

interface OwnProps {
    replay: Replay
    handleUpdateTags: (tag: Tag[]) => void
    useBoxScore?: boolean
    selectProps?: SelectProps
}

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})
export const getSkillAverages = (replay: Replay) => {
    let averageRank = 0
    let averageMMR = 0
    const filteredRanks = replay.ranks.filter((num) => num > 0)
    const filteredMMRs = replay.mmrs.filter((num) => num > 0)
    if (filteredRanks.length > 0) {
        averageRank = Math.round(
            filteredRanks.reduce((previous, current, idx) => previous + current) / filteredRanks.length
        )
        if (filteredMMRs.length > 0) {
            averageMMR = Math.round(
                filteredMMRs.reduce((previous, current, idx) => previous + current) / filteredMMRs.length
            )
        }
    }
    return {averageRank, averageMMR}
}
type Props = OwnProps & WithStyles<typeof styles> & WithWidth & ReturnType<typeof mapStateToProps>

class ReplayDisplayRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, replay, selectProps} = this.props
        return (
            <ExpansionPanel>
                <ReplayExpansionPanelSummary replay={replay}>
                    {selectProps && (
                        <Checkbox
                            checked={selectProps.selected}
                            onChange={this.toggleSelect}
                            color="secondary"
                            onClick={this.stopClickPropagation}
                            className={classes.checkboxPadding}
                        />
                    )}
                    <TagDialogWrapper replay={this.props.replay} handleUpdateTags={this.props.handleUpdateTags} small />
                    {this.props.loggedInUser &&
                        (this.props.loggedInUser.admin || // User is admin, or user is player in game
                            this.props.replay.players
                                .map((player) => player.id)
                                .includes(this.props.loggedInUser.id)) && (
                            <VisibilityToggle replay={this.props.replay} />
                        )}
                </ReplayExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panelDetails}>
                    {!this.props.useBoxScore ? (
                        <ReplayChart replay={this.props.replay} />
                    ) : (
                        <ReplayBoxScore replay={this.props.replay} />
                    )}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

    private readonly toggleSelect = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.props.selectProps!.handleSelectChange(checked)
    }

    private readonly stopClickPropagation: React.MouseEventHandler = (event) => {
        event.stopPropagation()
    }
}

export const ReplayDisplayRow = withWidth()(withStyles(styles)(connect(mapStateToProps)(ReplayDisplayRowComponent)))
