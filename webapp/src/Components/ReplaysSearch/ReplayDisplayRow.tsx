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
import { REPLAY_PAGE_LINK } from "../../Globals"
import { Replay } from "../../Models"
import { ReplayBoxScore } from "../Replay/ReplayBoxScore"
import { ReplayChart } from "../Replay/ReplayChart"
import { ColouredGameScore } from "../Shared/ColouredGameScore"
import { TagDialogWrapper } from "../Shared/Tag/TagDialogWrapper"

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

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth

class ReplayDisplayRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, width, replay, selectProps} = this.props
        const typographyVariant = "subtitle1"
        const dateFormat = isWidthUp("lg", width) ? "DD/MM/YYYY" : "DD/MM"

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
                <Grid item xs={1} className={classes.listGridItem}>
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
                <Grid item xs={2} className={classes.listGridItem}>
                    <Typography variant={typographyVariant}>
                        <ColouredGameScore replay={replay}/>
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.listGridItem}>
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
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>} >
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

export const ReplayDisplayRow = withWidth()(withStyles(styles)(ReplayDisplayRowComponent))
