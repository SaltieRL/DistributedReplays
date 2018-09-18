import {
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    IconButton, Theme,
    Typography, WithStyles, withStyles, withWidth
} from "@material-ui/core"
import {TextStyle} from "@material-ui/core/styles/createTypography"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import {REPLAY_PAGE_LINK} from "../../../../Globals"
import {getColouredGameScore, getReplayResult, Replay} from "../../../../Models/Replay/Replay"
import {ReplayChart} from "../../../Replay/ReplayChart"

interface DataProps {
    replay: Replay
    player: Player
    header?: false
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

        // These default values appear as the header
        let replayName: string = "Name"
        let replayDate: string = "Date"
        let replayGameMode: string = "Mode"
        let replayScore: JSX.Element = <>Score</>
        let replayResult: string = "Result"
        let dropdownIcon = <></>

        if (!this.props.header) {
            const {replay, player} = this.props
            const dateFormat = isWidthUp("md", width) ? "DD/MM/YYYY" : "DD/MM"
            replayName = replay.name
            replayDate = replay.date.format(dateFormat)
            replayGameMode = replay.gameMode
            replayScore = getColouredGameScore(replay)
            replayResult = getReplayResult(replay, player)
            dropdownIcon =
                <IconButton href={REPLAY_PAGE_LINK(replay.id)} className={classes.iconButton}>
                    <InsertChart/>
                </IconButton>
        }

        const typographyVariant: TextStyle = !this.props.header ? "subheading" : "title"

        const expansionPanelSummary =
            <ExpansionPanelSummary
                expandIcon={!this.props.header ? <ExpandMore/> : undefined}
                className={!this.props.header ? undefined : classes.notButton}
            >
                <Grid container>
                    <Grid item xs={notOnMobile ? 3 : 4}>
                        <Typography variant={typographyVariant}>
                            {replayName}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant={typographyVariant}>
                            {replayDate}
                        </Typography>
                    </Grid>
                    {notOnMobile &&
                    <Grid item xs={1}>
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
                        {dropdownIcon}
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>

        return (
            <>
                {!this.props.header ?
                    <ExpansionPanel>
                        {expansionPanelSummary}
                        <ExpansionPanelDetails className={classes.panelDetails}>
                            <ReplayChart replay={this.props.replay}/>
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
        cursor: "unset"
    },
    panelDetails: {
        overflowX: "auto",
        maxWidth: "95vw",
        margin: "auto"
    }
})

export const MatchHistoryRow = withWidth()(withStyles(styles)(MatchHistoryRowComponent))
