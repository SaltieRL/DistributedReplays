import {
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    IconButton, Theme,
    Typography, WithStyles, withStyles, withWidth
} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import {REPLAY_PAGE_LINK} from "../../../../Globals"
import {getColouredGameScore, getReplayResult, Replay} from "../../../../Models/Replay/Replay"
import {ReplayChart} from "../../../Replay/ReplayChart"

interface OwnProps {
    replay: Replay
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth

class MatchHistoryRowComponent extends React.PureComponent<Props> {
    public render() {
        const {replay, player, classes, width} = this.props
        const notOnMobile = isWidthUp("sm", width)
        const dateFormat = notOnMobile ? "DD/MM/YYYY" : "DD/MM"
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                    <Grid container>
                        <Grid item xs={notOnMobile ? 3 : 4}>
                            <Typography variant="subheading">
                                {replay.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="subheading">
                                {replay.date.format(dateFormat)}
                            </Typography>
                        </Grid>
                        {notOnMobile &&
                        <Grid item xs={1}>
                            <Typography variant="subheading">
                                {replay.gameMode}
                            </Typography>
                        </Grid>
                        }
                        <Grid item xs={2}>
                            <Typography variant="subheading">
                                {getColouredGameScore(replay)}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subheading">
                                {getReplayResult(replay, player)}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton href={REPLAY_PAGE_LINK(replay.id)} className={classes.iconButton}>
                                <InsertChart/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panelDetails}>
                    <ReplayChart replay={replay}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
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
    panelDetails: {
        overflowX: "auto"
    }
})

export const MatchHistoryRow = withWidth()(withStyles(styles)(MatchHistoryRowComponent))
