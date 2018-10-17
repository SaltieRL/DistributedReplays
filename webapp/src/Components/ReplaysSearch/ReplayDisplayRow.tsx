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
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import {REPLAY_PAGE_LINK} from "../../Globals"
import {getColouredGameScore, Replay} from "../../Models/Replay/Replay"
import {ReplayBoxScore} from "../Replay/ReplayBoxScore"
import {ReplayChart} from "../Replay/ReplayChart"

interface SelectProps {
    selected: boolean
    handleSelectChange: (selected: boolean) => void
}

interface OwnProps {
    replay: Replay
    useBoxScore?: boolean
    selectProps?: SelectProps
}

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth

class ReplayDisplayRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, width, replay} = this.props
        const typographyVariant = "subheading"
        const dateFormat = isWidthUp("md", width) ? "DD/MM/YYYY" : "DD/MM"

        const contents =
            <Grid container>
                {this.props.selectProps &&
                <Grid item xs={1} zeroMinWidth>
                    <Checkbox style={{padding: 0}} onChange={this.toggleSelect} color={"secondary"}/>
                </Grid>
                }
                <Grid item xs={this.props.selectProps ? 2 : 3} zeroMinWidth>
                    <Typography variant={typographyVariant} noWrap>
                        {replay.name}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Tooltip title={replay.date.format("LLLL")} enterDelay={200} placement="bottom-start">
                        <Typography variant={typographyVariant}>
                            {replay.date.format(dateFormat)}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={3} zeroMinWidth>
                    <Typography variant={typographyVariant} noWrap>
                        {replay.gameMode}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant={typographyVariant}>
                        {getColouredGameScore(replay)}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton href={REPLAY_PAGE_LINK(replay.id)} className={classes.iconButton}>
                        <InsertChart/>
                    </IconButton>
                </Grid>
            </Grid>

        return (
            <>
                {this.props.selectProps ?
                    <ListItem selected={this.props.selectProps.selected}>
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
        overflowX: "auto",
        maxWidth: "95vw",
        margin: "auto"
    }
})

export const ReplayDisplayRow = withWidth()(withStyles(styles)(ReplayDisplayRowComponent))
