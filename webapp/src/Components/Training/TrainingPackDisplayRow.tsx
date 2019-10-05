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
import OpenInNew from "@material-ui/icons/OpenInNew"
import * as React from "react"
import { connect } from "react-redux"
import { REPLAY_PAGE_LINK } from "../../Globals"
import { TrainingPack, TrainingPackShot } from "../../Models/Player/TrainingPack"
import { StoreState } from "../../Redux"

const styles = (theme: Theme) => createStyles({
    iconButton: {
        "height": "20px",
        "width": "20px",
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
    pack: TrainingPack
    selectProps?: SelectProps
}

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth
    & ReturnType<typeof mapStateToProps>

class TrainingPackDisplayRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, width, pack, selectProps} = this.props
        const typographyVariant = "subtitle1"
        const dateFormat = isWidthUp("lg", width) ? "DD/MM/YYYY" : "DD/MM"

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
                        {pack.guid}
                    </Typography>
                </Grid>
                <Grid item xs={2} sm={3} className={classes.listGridItem}>
                    <Tooltip title={pack.date.format("LLLL")} enterDelay={200} placement="bottom-start">
                        <Typography variant={typographyVariant}>
                            {pack.date.format(dateFormat)}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs="auto" className={classes.listGridItem}>
                    <IconButton
                        href={pack.link}
                        className={classes.iconButton}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <OpenInNew/>
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
                            <Grid container>
                                {pack.shots.map((shot: TrainingPackShot, i) => {
                                    const minutes = Math.floor(shot.timeRemaining / 60)
                                    let seconds = (shot.timeRemaining % 60).toString()
                                    if (seconds.length === 1) {
                                        seconds = "0" + seconds
                                    }
                                    return (
                                        <>
                                            <Grid container item xs={12} key={shot.game + shot.frame.toString()}>
                                                <Grid item xs={4}>
                                                    <Typography>
                                                        Shot {i + 1}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>
                                                        {minutes}:{seconds} remaining
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography>
                                                        <IconButton
                                                            className={classes.iconButton}
                                                            href={REPLAY_PAGE_LINK(shot.game)}>
                                                            <InsertChart/>
                                                        </IconButton>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )
                                })}
                            </Grid>
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

export const TrainingPackDisplayRow = withWidth()(withStyles(styles)(connect(mapStateToProps)(TrainingPackDisplayRowComponent)))
