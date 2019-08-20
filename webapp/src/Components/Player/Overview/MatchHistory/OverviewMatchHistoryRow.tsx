import {
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
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
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import { REPLAY_PAGE_LINK } from "../../../../Globals"
import { getReplayResult, Replay } from "../../../../Models"
import { ReplayBoxScore } from "../../../Replay/ReplayBoxScore"
import { ReplayChart } from "../../../Replay/ReplayChart"
import { ColouredGameScore } from "../../../Shared/ColouredGameScore"

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
    }
})

interface OwnProps {
    replay: Replay
    player: Player
    useBoxScore?: boolean
}

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth

class OverviewMatchHistoryRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, width} = this.props
        const notOnMobile = isWidthUp("sm", width)
        const typographyVariant = "subtitle1"

        const {replay, player} = this.props
        const dateFormat = isWidthUp("md", width) ? "DD/MM/YYYY" : "DD/MM"
        const replayName = replay.name
        const replayDate = (
            <Tooltip title={replay.date.format("LLLL")} enterDelay={200} placement="bottom-start">
                <Typography variant={notOnMobile ? typographyVariant : "caption"}>
                    {replay.date.format(dateFormat)}
                </Typography>
            </Tooltip>
        )
        const replayGameMode = replay.gameMode
        const replayScore = <ColouredGameScore replay={replay}/>
        const replayResult = getReplayResult(replay, player)

        const averageRank = Math.round(replay.ranks.reduce((previous, current, idx) => previous + current)
            / replay.ranks.length)
        const averageMMR = Math.round(replay.mmrs.filter((num) => num > 0)
                .reduce((previous, current, idx) => previous + current)
            / replay.mmrs.filter((num) => num > 0).length)
        const replayRank = (
            <Tooltip title={averageMMR.toString()}>
                <img alt=""
                     style={{width: 28, height: 28, margin: "auto"}}
                     src={`${window.location.origin}/ranks/${averageRank}.png`}/>
            </Tooltip>
        )
        const chartIcon = (
            <IconButton href={REPLAY_PAGE_LINK(replay.id)} className={classes.iconButton}>
                <InsertChart/>
            </IconButton>
        )

        const expansionPanelSummary = (
            <ExpansionPanelSummary
                expandIcon={<ExpandMore/>}
            >
                <Grid container>
                    {notOnMobile ? (
                        <>
                            <Grid item xs={3}>
                                <Typography variant={typographyVariant} noWrap>
                                    {replayName}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                {replayDate}
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant={typographyVariant} noWrap>
                                    {replayGameMode}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant={typographyVariant}>
                                    {replayScore}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant={typographyVariant}>
                                    {replayResult}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography variant={typographyVariant}>
                                    {replayRank}
                                </Typography>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid item xs={4}>
                                <Typography variant={typographyVariant} noWrap>
                                    {replayName}
                                </Typography>
                                {replayDate}
                            </Grid>
                            <Grid item xs={3} style={{margin: "auto"}}>
                                <Typography variant={typographyVariant} noWrap>
                                    {replayGameMode}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant={typographyVariant}>
                                    {replayScore}
                                </Typography>
                                <Typography variant={notOnMobile ? typographyVariant : "caption"}>
                                    {replayResult}
                                </Typography>
                            </Grid>
                        </>
                    )}

                    <Grid item xs={1} style={{margin: "auto"}}>
                        {chartIcon}
                    </Grid>

                </Grid>
            </ExpansionPanelSummary>
        )

        return (
            <ExpansionPanel>
                {expansionPanelSummary}
                <ExpansionPanelDetails className={classes.panelDetails}>
                    {!this.props.useBoxScore ?
                        <ReplayChart replay={this.props.replay}/>
                        :
                        <ReplayBoxScore replay={this.props.replay} player={this.props.player}/>
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

export const OverviewMatchHistoryRow = withWidth()(withStyles(styles)(OverviewMatchHistoryRowComponent))
