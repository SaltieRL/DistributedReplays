import {
    createStyles,
    ExpansionPanelSummary,
    Grid,
    IconButton,
    Theme,
    Tooltip,
    Typography,
    WithStyles,
    withStyles,
    withWidth
} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import {Link, LinkProps} from "react-router-dom"

import {REPLAY_PAGE_LINK} from "../../../../Globals"
import {getReplayResult, Replay} from "../../../../Models"
import {sanitizeProfanity} from "../../../../Utils/String"
import {getSkillAverages} from "../../../ReplaysSearch/ReplayDisplayRow"
import {ColouredGameScore} from "../../../Shared/ColouredGameScore"

const styles = (theme: Theme) =>
    createStyles({
        iconButton: {
            height: 20,
            width: 20,
            color: theme.palette.secondary.main,
            "&:hover": {
                transitionProperty: "transform",
                transitionDuration: "100ms",
                transform: "scale(1.2)",
                color: theme.palette.secondary.dark
            },
            marginLeft: 8
        },
        rankIcon: {
            width: 28,
            height: 28,
            margin: "auto",
            marginLeft: 8
        },
        panelSummaryContent: {
            width: "100%",
            alignItems: "center"
        },
        panelSummaryItemWrapper: {
            minWidth: 100,
            flex: 1
        }
    })

interface OwnProps {
    replay: Replay
    player?: Player
}

type Props = OwnProps & WithStyles<typeof styles> & WithWidth

class ReplayExpansionPanelSummaryComponent extends React.PureComponent<Props> {
    private readonly createReplayLink = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
        (props, ref) => <Link to={REPLAY_PAGE_LINK(this.props.replay.id)} {...props} innerRef={ref} />
    )

    public render() {
        const {classes, width} = this.props
        const notOnMobile = isWidthUp("sm", width)
        const typographyVariant = "subtitle1"

        const {replay, player} = this.props
        const dateFormat = isWidthUp("lg", width) ? "DD/MM/YYYY" : "DD/MM"
        const replayName = sanitizeProfanity(replay.name)
        const replayDate = (
            <Tooltip title={replay.date.format("LLLL")} enterDelay={200} placement="bottom-start">
                <Typography variant={notOnMobile ? typographyVariant : "caption"}>
                    {replay.date.format(dateFormat)}
                </Typography>
            </Tooltip>
        )
        const replayGameMode = replay.gameMode
        const replayScore = <ColouredGameScore replay={replay} />

        const {averageRank, averageMMR} = getSkillAverages(replay)
        const replayRank = (
            <Tooltip title={averageMMR > 0 ? averageMMR.toString() : "Unranked"}>
                <img
                    alt={`rank ${averageRank}`}
                    className={classes.rankIcon}
                    src={`${window.location.origin}/ranks/${averageRank}.png`}
                />
            </Tooltip>
        )
        const chartIcon = (
            <IconButton component={this.createReplayLink} className={classes.iconButton}>
                <InsertChart />
            </IconButton>
        )

        return (
            <ExpansionPanelSummary expandIcon={<ExpandMore />} classes={{content: classes.panelSummaryContent}}>
                <div className={classes.panelSummaryItemWrapper}>
                    <Grid container spacing={1} justify="space-between">
                        {notOnMobile ? (
                            <>
                                <Grid item xs={5} xl={6}>
                                    <Typography variant={typographyVariant} noWrap>
                                        {replayName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} lg={3} xl={2}>
                                    {replayDate}
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant={typographyVariant} noWrap>
                                        {replayGameMode}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} lg={1}>
                                    <Typography variant={typographyVariant}>{replayScore}</Typography>
                                </Grid>
                                {player && (
                                    <Grid item xs={1}>
                                        <Typography variant={typographyVariant}>
                                            {getReplayResult(replay, player)}
                                        </Typography>
                                    </Grid>
                                )}
                            </>
                        ) : (
                            <>
                                <Grid item xs={5} container alignItems="center">
                                    <Typography variant={typographyVariant} noWrap>
                                        {replayName}
                                    </Typography>
                                    {replayDate}
                                </Grid>
                                <Grid item xs={4} container alignItems="center">
                                    <Typography variant={typographyVariant} noWrap>
                                        {replayGameMode}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} style={{textAlign: "center", margin: "auto"}}>
                                    <Typography variant={typographyVariant}>{replayScore}</Typography>
                                    {player && (
                                        <Typography variant="caption">{getReplayResult(replay, player)}</Typography>
                                    )}
                                </Grid>
                            </>
                        )}
                    </Grid>
                </div>
                {this.props.children}
                {replayRank}
                {chartIcon}
            </ExpansionPanelSummary>
        )
    }
}

export const ReplayExpansionPanelSummary = withWidth()(withStyles(styles)(ReplayExpansionPanelSummaryComponent))
