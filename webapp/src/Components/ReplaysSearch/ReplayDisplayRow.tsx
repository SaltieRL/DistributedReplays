import {
    Checkbox,
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
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import {REPLAY_PAGE_LINK} from "../../Globals"
import {getColouredGameScore, Replay} from "../../Models/Replay/Replay"
import {ReplayBoxScore} from "../Replay/ReplayBoxScore"
import {ReplayChart} from "../Replay/ReplayChart"

interface DataProps {
    replay: Replay
    header?: false
    useBoxScore?: boolean
    selectable?: boolean
    onChecked?: (id: string, checked: boolean) => void
}

interface HeaderProps {
    header: true
}

interface State {
    selected: boolean
}

type OwnProps = DataProps | HeaderProps

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth

class ReplayDisplayRowComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selected: false}
    }

    public render() {
        const {classes, width} = this.props
        const typographyVariant = !this.props.header ? "subheading" : "title"

        // These default values appear as the header
        let replayName: string = "Name"
        let replayDate: React.ReactNode = <Typography variant={typographyVariant}>"Date"</Typography>
        let replayGameMode: string = "Mode"
        let replayScore: React.ReactNode = "Score"
        let chartIcon: React.ReactNode = null

        if (!this.props.header) {
            const {replay} = this.props
            const dateFormat = isWidthUp("md", width) ? "DD/MM/YYYY" : "DD/MM"
            replayName = replay.name
            replayDate = (
                <Tooltip title={replay.date.format("LLLL")} enterDelay={200} placement="bottom-start">
                    <Typography variant={typographyVariant}>
                        {replay.date.format(dateFormat)}
                    </Typography>
                </Tooltip>
            )
            replayGameMode = replay.gameMode
            replayScore = getColouredGameScore(replay)
            chartIcon =
                <IconButton href={REPLAY_PAGE_LINK(replay.id)} className={classes.iconButton}>
                    <InsertChart/>
                </IconButton>
        }

        const innard = <Grid container style={{
            padding: (!this.props.header && this.props.selectable) ? "10px" : "",
            backgroundColor: this.state.selected ? "#c2dbff" : "#fff"
        }}>
            {(!this.props.header && this.props.selectable) &&
            <Grid item xs={1} zeroMinWidth>
                <Checkbox style={{padding: 0}} onChange={this.toggleSelect} color={"secondary"}/>
            </Grid>
            }

            <Grid item xs={(!this.props.header && this.props.selectable) ? 2 : 3} zeroMinWidth>
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
                <Typography variant={typographyVariant}>
                    {replayScore}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                {chartIcon}
            </Grid>
        </Grid>

        const expansionPanelSummary =
            <ExpansionPanelSummary
                expandIcon={!this.props.header ? <ExpandMore/> : undefined}
                className={!this.props.header ? undefined : classes.notButton}
            >
                {innard}
            </ExpansionPanelSummary>

        return (
            <>
                {!this.props.header && !this.props.selectable &&
                <ExpansionPanel>
                    {expansionPanelSummary}
                    <ExpansionPanelDetails className={classes.panelDetails}>
                        {!this.props.useBoxScore ?
                            <ReplayChart replay={this.props.replay}/>
                            :
                            <ReplayBoxScore replay={this.props.replay}/>
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                }
                {(!this.props.header && this.props.selectable) && innard}
            </>
        )
    }

    private readonly toggleSelect = (event: object, checked: boolean) => {
        this.setState({selected: checked})
        if (!this.props.header) {
            if (this.props.onChecked) {
                this.props.onChecked(this.props.replay.id, checked)
            }
        }
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

export const ReplayDisplayRow = withWidth()(withStyles(styles)(ReplayDisplayRowComponent))
