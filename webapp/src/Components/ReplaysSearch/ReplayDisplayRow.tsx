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
import { ColouredGameScore } from "src/Components/Shared/ColouredGameStore"
import { Replay } from "src/Models"
import { REPLAY_PAGE_LINK } from "../../Globals"
import { ReplayBoxScore } from "../Replay/ReplayBoxScore"
import { ReplayChart } from "../Replay/ReplayChart"

interface DataProps {
    replay: Replay
    header?: false
    useBoxScore?: boolean
}

interface HeaderProps {
    header: true
}

type OwnProps = DataProps | HeaderProps

type Props = OwnProps & WithStyles<typeof styles> & WithWidth

class ReplayDisplayRowComponent extends React.PureComponent<Props> {
    public render() {
        const { classes, width } = this.props
        const typographyVariant = !this.props.header ? "subheading" : "title"

        // These default values appear as the header
        let replayName: string = "Name"
        let replayDate: React.ReactNode = <Typography variant={typographyVariant}>"Date"</Typography>
        let replayGameMode: string = "Mode"
        let replayScore: React.ReactNode = "Score"
        let chartIcon: React.ReactNode = null

        if (!this.props.header) {
            const { replay } = this.props
            const dateFormat = isWidthUp("md", width) ? "DD/MM/YYYY" : "DD/MM"
            replayName = replay.name
            replayDate = (
                <Tooltip title={replay.date.format("LLLL")} enterDelay={200} placement="bottom-start">
                    <Typography variant={typographyVariant}>{replay.date.format(dateFormat)}</Typography>
                </Tooltip>
            )
            replayGameMode = replay.gameMode
            replayScore = <ColouredGameScore replay={replay} />
            chartIcon = (
                <IconButton href={REPLAY_PAGE_LINK(replay.id)} className={classes.iconButton}>
                    <InsertChart />
                </IconButton>
            )
        }

        const expansionPanelSummary = (
            <ExpansionPanelSummary
                expandIcon={!this.props.header ? <ExpandMore /> : undefined}
                className={!this.props.header ? undefined : classes.notButton}
            >
                <Grid container>
                    <Grid item xs={3} zeroMinWidth>
                        <Typography variant={typographyVariant} noWrap>
                            {replayName}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        {replayDate}
                    </Grid>
                    <Grid item xs={3} zeroMinWidth>
                        <Typography variant={typographyVariant} noWrap>
                            {replayGameMode}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant={typographyVariant}>{replayScore}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        {chartIcon}
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>
        )

        return (
            <>
                {!this.props.header ? (
                    <ExpansionPanel>
                        {expansionPanelSummary}
                        <ExpansionPanelDetails className={classes.panelDetails}>
                            {!this.props.useBoxScore ? (
                                <ReplayChart replay={this.props.replay} />
                            ) : (
                                <ReplayBoxScore replay={this.props.replay} />
                            )}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ) : (
                    expansionPanelSummary
                )}
            </>
        )
    }
}

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

export const ReplayDisplayRow = withWidth()(withStyles(styles)(ReplayDisplayRowComponent))
