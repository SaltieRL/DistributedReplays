import {
    Checkbox,
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    IconButton,
    ListItem,
    Theme,
    Tooltip,
    Typography,
    WithStyles,
    withStyles,
    withWidth
} from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import { connect } from "react-redux"
import { REPLAY_PAGE_LINK } from "../../Globals"
import { Replay } from "../../Models"
import { StoreState } from "../../Redux"
import { ReplayBoxScore } from "../Replay/ReplayBoxScore"
import { ReplayChart } from "../Replay/ReplayChart"
import { ColouredGameScore } from "../Shared/ColouredGameScore"
import { TagDialogWrapper } from "../Shared/Tag/TagDialogWrapper"
import { VisibilityToggle } from "./VisibilityToggle."

const styles = (theme: Theme) => createStyles({
    iconButton: {
        "height": 20,
        "width": 20,
        "color": theme.palette.secondary.main,
        "&:hover": {
            transitionProperty: "transform",
            transitionDuration: "100ms",
            transform: "scale(1.2)",
            color: theme.palette.secondary.dark
        }
    },
    panelDetails: {
        overflowX: "auto",
        maxWidth: "95vw",
        margin: "auto"
    },
    listGridItem: {
        margin: "auto"
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
    if (replay.ranks.length > 0) {
        averageRank = Math.round(replay.ranks
                .filter((num) => num > 0)
                .reduce((previous, current, idx) => previous + current)
            / replay.ranks.length)
        averageMMR = Math.round(replay.mmrs.filter((num) => num > 0)
                .reduce((previous, current, idx) => previous + current)
            / replay.mmrs.filter((num) => num > 0).length)
    }
    return {averageRank, averageMMR}
}
type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth
    & ReturnType<typeof mapStateToProps>

class ReplayDisplayRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, width, replay, selectProps} = this.props
        const typographyVariant = "subtitle1"
        const dateFormat = isWidthUp("lg", width) ? "DD/MM/YYYY" : "DD/MM"

        // replay stuff
        const {averageRank, averageMMR} = getSkillAverages(replay)
        const replayRank = (
            <Tooltip title={averageMMR > 0 ? averageMMR.toString() : "Unranked"}>
                <img alt=""
                     style={{width: 28, height: 28, margin: "auto"}}
                     src={`${window.location.origin}/ranks/${averageRank}.png`}/>
            </Tooltip>
        )

        const aboveSm = isWidthUp("sm", width)
        const contents = (
            <Grid container>
                {selectProps && (
                    <Grid item sm={1}>
                        <Checkbox checked={selectProps.selected}
                                  onChange={this.toggleSelect}
                                  color="secondary"/>
                    </Grid>
                )}

                <Grid item xs={selectProps ? 2 : 3} zeroMinWidth
                      className={classes.listGridItem}>
                    <Typography variant={typographyVariant} noWrap>
                        {replay.name}
                    </Typography>
                    {selectProps &&
                    <Typography variant="caption" noWrap>
                        {replay.players
                            .map((player) => player.name)
                            .join(", ")
                        }
                    </Typography>
                    }
                </Grid>
                {this.props.loggedInUser &&
                (this.props.loggedInUser.admin ||  // User is admin, or user is player in game
                    this.props.replay.players.map((player) => player.id).indexOf(this.props.loggedInUser.id) !== -1) &&
                <Grid item xs="auto" className={classes.listGridItem}>
                    <VisibilityToggle replay={this.props.replay}/>
                </Grid>
                }
                <Grid item xs="auto" className={classes.listGridItem}>
                    <TagDialogWrapper
                        replay={this.props.replay}
                        handleUpdateTags={this.props.handleUpdateTags}
                        small/>
                </Grid>
                <Grid item xs={2} sm={3} className={classes.listGridItem}>
                    <Tooltip title={replay.date.format("LLLL")} enterDelay={200} placement="bottom-start">
                        <Typography variant={typographyVariant}>
                            {replay.date.format(dateFormat)}
                        </Typography>
                    </Tooltip>
                </Grid>
                {aboveSm && (
                    <Grid item xs={2} zeroMinWidth className={classes.listGridItem}>
                        <Typography variant={typographyVariant} noWrap>
                            {replay.gameMode}
                        </Typography>
                    </Grid>
                )}
                <Grid item xs={2} sm={1} className={classes.listGridItem}>
                    <Typography variant={typographyVariant}>
                        <ColouredGameScore replay={replay}/>
                    </Typography>
                </Grid>
                {aboveSm && (
                    <Grid item xs={1} className={classes.listGridItem}>
                        {replayRank}
                    </Grid>
                )}
                <Grid item xs="auto" className={classes.listGridItem}>
                    <IconButton
                        href={REPLAY_PAGE_LINK(replay.id)}
                        className={classes.iconButton}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <InsertChart/>
                    </IconButton>
                </Grid>
            </Grid>
        )

        return (
            <>
                {selectProps ?
                    <ListItem selected={selectProps.selected}
                              onClick={() => selectProps!.handleSelectChange(!selectProps.selected)}>
                        {contents}
                    </ListItem>
                    :
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            {contents}
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.panelDetails}>
                            {!this.props.useBoxScore ?
                                <ReplayChart replay={this.props.replay}/>
                                :
                                <ReplayBoxScore replay={this.props.replay}/>
                            }
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                }
            </>
        )
    }

    private readonly toggleSelect = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.props.selectProps!.handleSelectChange(checked)
    }
}

export const ReplayDisplayRow = withWidth()(withStyles(styles)(connect(mapStateToProps)(ReplayDisplayRowComponent)))
