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
import {TextStyle} from "@material-ui/core/styles/createTypography"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import {REPLAY_PAGE_LINK} from "../../../../Globals"
import {getColouredGameScore, getReplayResult, Replay} from "../../../../Models/Replay/Replay"
import {ReplayBoxScore} from "../../../Replay/ReplayBoxScore"
import {ReplayChart} from "../../../Replay/ReplayChart"

interface DataProps {
    replay: Replay
    player: Player
    header?: false
    useBoxScore?: boolean
}

interface HeaderProps {
    header: true
}

type OwnProps = DataProps | HeaderProps

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth

class MatchHistoryRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, width} = this.props
        const notOnMobile = isWidthUp("sm", width)
        const typographyVariant: TextStyle = !this.props.header ? "subheading" : "title"

        // These default values appear as the header
        let replayName: string = "Name"
        let replayDate: React.ReactNode = "Date"
        let replayGameMode: string = "Mode"
        let replayScore: React.ReactNode = "Score"
        let replayResult: string = "Result"
        let chartIcon = <></>

        if (!this.props.header) {
            const {replay, player} = this.props
            const dateFormat = isWidthUp("md", width) ? "DD/MM/YYYY" : "DD/MM"
            replayName = replay.name
            replayDate = (
                <Tooltip title={replay.date.format("LLLL")} enterDelay={200}>
                    <Typography variant={typographyVariant}>
                        {replay.date.format(dateFormat)}
                    </Typography>
                </Tooltip>
            )
            replayGameMode = replay.gameMode
            replayScore = getColouredGameScore(replay)
            replayResult = getReplayResult(replay, player)
            chartIcon =
                <IconButton href={REPLAY_PAGE_LINK(replay.id)} className={classes.iconButton}>
                    <InsertChart/>
                </IconButton>
        }

        const expansionPanelSummary =
            <ExpansionPanelSummary
                expandIcon={!this.props.header ? <ExpandMore/> : undefined}
                className={!this.props.header ? undefined : classes.notButton}
            >
                <Grid container>
                    <Grid item xs={notOnMobile ? 3 : 5}>
                        <Typography variant={typographyVariant} noWrap>
                            {replayName}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant={typographyVariant}>
                            {replayDate}
                        </Typography>
                    </Grid>
                    {notOnMobile &&
                    <Grid item xs={2}>
                        <Typography variant={typographyVariant}>
                            {replayGameMode}
                        </Typography>
                    </Grid>
                    }
                    <Grid item xs={2}>
                        <Typography variant={typographyVariant}>
                            {replayScore}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant={typographyVariant}>
                            {replayResult}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        {chartIcon}
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>

        return (
            <>
                {!this.props.header ?
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
                    :
                    expansionPanelSummary
                }
            </>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    iconButton: {
        height: 20,
        width: 20,
        color: theme.palette.secondary.main,
        "&:hover": {
            transitionProperty: "transform",
            transitionDuration: "100ms",
            transform: "scale(1.2)",
            color: theme.palette.secondary.dark
        }
    },
    notButton: {
        cursor: "auto !important"
    },
    panelDetails: {
        overflowX: "auto",
        maxWidth: "95vw",
        margin: "auto"
    }
})

export const MatchHistoryRow = withWidth()(withStyles(styles)(MatchHistoryRowComponent))
