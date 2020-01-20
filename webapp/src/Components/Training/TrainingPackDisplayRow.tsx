import {
    Checkbox,
    createStyles,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    IconButton,
    List,
    ListItem,
    Theme,
    Tooltip,
    Typography,
    WithStyles,
    withStyles,
    withWidth
} from "@material-ui/core"
import Divider from "@material-ui/core/Divider"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import ExpandMore from "@material-ui/icons/ExpandMore"
import InsertChart from "@material-ui/icons/InsertChart"
import OpenInNew from "@material-ui/icons/OpenInNew"
import PlayArrow from "@material-ui/icons/PlayArrow"
import Share from "@material-ui/icons/Share"
import moment from "moment"
import * as React from "react"
import {connect} from "react-redux"
import {REPLAY_PAGE_LINK, TRAINING_IMPORT_LINK} from "../../Globals"
import {CompactReplay} from "../../Models"
import {TrainingPack, TrainingPackShot} from "../../Models/Player/TrainingPack"
import {StoreState} from "../../Redux"
import clipboardCopy from "../../Utils/CopyToClipboard/clipboard"
import {ColouredGameScore} from "../Shared/ColouredGameScore"
import {WithNotifications, withNotifications} from "../Shared/Notification/NotificationUtils"

const styles = (theme: Theme) =>
    createStyles({
        iconButton: {
            height: "20px",
            width: "20px",
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
        },
        listGridItem: {
            margin: "auto"
        },
        cell: {
            textAlign: "center"
        }
    })

interface SelectProps {
    selected: boolean
    handleSelectChange: (selected: boolean) => void
}

interface OwnProps {
    pack: TrainingPack
    selectProps?: SelectProps
    selectShotHandler: any
    gameMap: Record<string, CompactReplay>
}

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

type Props = OwnProps & WithStyles<typeof styles> & WithWidth & WithNotifications & ReturnType<typeof mapStateToProps>

class TrainingPackDisplayRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, width, pack, selectProps} = this.props
        const typographyVariant = "subtitle1"
        const dateFormat = isWidthUp("lg", width) ? "DD/MM/YYYY" : "DD/MM"

        const contents = (
            <Grid container>
                {selectProps && (
                    <Grid item sm={1}>
                        <Checkbox checked={selectProps.selected} onChange={this.toggleSelect} color="secondary" />
                    </Grid>
                )}

                <Grid item xs={selectProps ? 3 : 4} zeroMinWidth className={classes.listGridItem}>
                    <Tooltip title={pack.name}>
                        <Typography variant={typographyVariant} noWrap>
                            {pack.name}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={2} sm={3} className={classes.listGridItem}>
                    <Tooltip title={pack.date.format("LLLL")} enterDelay={200} placement="bottom-start">
                        <Typography variant={typographyVariant}>{pack.date.format(dateFormat)}</Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={2} sm={3} className={classes.listGridItem}>
                    <Typography variant={typographyVariant}>{pack.shots.length} shots</Typography>
                </Grid>
                <Grid item xs={1} className={classes.listGridItem}>
                    <Tooltip title={"Share this pack"}>
                        <IconButton
                            href={"#"}
                            className={classes.iconButton}
                            onClick={(event) => {
                                clipboardCopy(window.location.origin + TRAINING_IMPORT_LINK(pack.guid)).then(() => {
                                    this.props.showNotification({
                                        variant: "success",
                                        message: "Successfully copied share link to clipboard!",
                                        timeout: 3000
                                    })
                                })
                                event.stopPropagation()
                            }}
                        >
                            <Share />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1} className={classes.listGridItem}>
                    <Tooltip title={pack.guid + ".Tem"}>
                        <IconButton
                            href={pack.link}
                            className={classes.iconButton}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <OpenInNew />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        )

        return (
            <>
                {selectProps ? (
                    <ListItem
                        selected={selectProps.selected}
                        onClick={() => selectProps!.handleSelectChange(!selectProps.selected)}
                    >
                        {contents}
                    </ListItem>
                ) : (
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMore />}>{contents}</ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.panelDetails}>
                            <List dense style={{width: "100%"}}>
                                <ListItem>
                                    <Grid container key={"header"}>
                                        <Grid item xs={1} className={classes.cell}>
                                            <Typography variant="subtitle2">Shot</Typography>
                                        </Grid>
                                        <Grid item xs={2} className={classes.cell}>
                                            <Typography variant="subtitle2">Time remaining</Typography>
                                        </Grid>
                                        <Grid item xs={2} className={classes.cell}>
                                            <Typography variant="subtitle2">Game date</Typography>
                                        </Grid>
                                        <Grid item xs={2} className={classes.cell}>
                                            <Typography variant="subtitle2">Game playlist</Typography>
                                        </Grid>
                                        <Grid item xs={2} className={classes.cell}>
                                            <Typography variant="subtitle2">Game score</Typography>
                                        </Grid>
                                        <Grid item xs={1} className={classes.cell} />
                                        <Grid item xs={1} className={classes.cell}>
                                            <Typography variant="subtitle2">View game</Typography>
                                        </Grid>
                                        <Grid item xs={1} className={classes.cell}>
                                            <Typography variant="subtitle2">Preview shot</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <Divider />
                                {pack.shots.map((shot: TrainingPackShot, i) => {
                                    // TODO Refactorise into component
                                    const minutes = Math.floor(shot.timeRemaining / 60)
                                    let seconds = (shot.timeRemaining % 60).toString()
                                    if (seconds.length === 1) {
                                        seconds = "0" + seconds
                                    }
                                    const replay = this.props.gameMap[shot.game]
                                    const replayTime = moment(replay.date)
                                    const replayDate = (
                                        <Tooltip
                                            title={replayTime.format("LLLL")}
                                            enterDelay={200}
                                            placement="bottom-start"
                                        >
                                            <Typography>{replayTime.format(dateFormat)}</Typography>
                                        </Tooltip>
                                    )
                                    return (
                                        <>
                                            <ListItem>
                                                <Grid container key={shot.game + shot.frame.toString()}>
                                                    <Grid item xs={1} className={classes.cell}>
                                                        <Typography>{i + 1}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} className={classes.cell}>
                                                        <Typography>
                                                            {minutes}:{seconds}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={2} className={classes.cell}>
                                                        {replayDate}
                                                    </Grid>
                                                    <Grid item xs={2} className={classes.cell}>
                                                        <Typography noWrap>{replay.gameMode}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2} className={classes.cell}>
                                                        <Typography noWrap>
                                                            <ColouredGameScore replay={replay} />
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={1} className={classes.cell} />
                                                    <Grid item xs={1} className={classes.cell}>
                                                        <Typography>
                                                            <IconButton
                                                                className={classes.iconButton}
                                                                href={REPLAY_PAGE_LINK(shot.game)}
                                                            >
                                                                <InsertChart />
                                                            </IconButton>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={1} className={classes.cell}>
                                                        <Typography>
                                                            <IconButton
                                                                className={classes.iconButton}
                                                                onClick={() => {
                                                                    this.props.selectShotHandler(i)
                                                                }}
                                                                href={"#"}
                                                            >
                                                                <PlayArrow />
                                                            </IconButton>
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            {i !== pack.shots.length - 1 && <Divider />}
                                        </>
                                    )
                                })}
                            </List>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )}
            </>
        )
    }

    private readonly toggleSelect = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        this.props.selectProps!.handleSelectChange(checked)
    }
}

export const TrainingPackDisplayRow = withWidth()(
    withStyles(styles)(withNotifications()(connect(mapStateToProps)(TrainingPackDisplayRowComponent)))
)
