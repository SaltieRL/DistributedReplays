import {faCamera, faCarSide} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    WithStyles,
    withStyles, withWidth
} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {getColouredGameScore, Replay} from "../../Models/Replay/Replay"
import {ReplayChart} from "./ReplayChart"
import {ReplayContent} from "./ReplayContent"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth

class ReplayViewComponent extends React.PureComponent<Props> {
    public render() {
        const replay = this.props.replay
        const blueCard =
            <Card square style={{minHeight: "100%"}}>
                <CardHeader
                    title="Blue"
                    titleTypographyProps={{align: "center"}}
                    className={this.props.classes.blueCard}/>
                <Divider/>
                <CardContent>
                    <List>
                        {replay.players
                            .filter((player) => !player.isOrange)
                            .map(this.createListItem)
                        }
                    </List>
                </CardContent>
            </Card>
        const orangeCard =
            <Card square style={{minHeight: "100%"}}>
                <CardHeader title="Orange" titleTypographyProps={{align: "center"}}
                            style={{backgroundColor: "bisque"}}/>
                <Divider/>
                <CardContent>
                    <List>
                        {replay.players
                            .filter((player) => player.isOrange)
                            .map(this.createListItem)
                        }
                    </List>
                </CardContent>
            </Card>

        const replayChartCard =
            <Card>
                <CardHeader title={replay.name ? replay.name : "Unnamed replay"}
                            subheader={getColouredGameScore(replay)}
                            titleTypographyProps={{align: "center"}}
                            subheaderTypographyProps={{align: "center", variant: "subheading"}}/>
                <CardContent>
                    <ReplayChart replay={replay}/>
                </CardContent>
            </Card>

        const blueGridItem =
            <Grid item xs={6} lg={3}>
                {blueCard}
            </Grid>
        const replayChartGridItem =
            <Grid item xs={12} lg={6}>
                {replayChartCard}
            </Grid>
        const orangeGridItem =
            <Grid item xs={6} lg={3}>
                {orangeCard}
            </Grid>

        return (
            <>
                {replay &&
                <Grid container spacing={24}>
                    {isWidthUp("lg", this.props.width) ?
                        <>
                            {blueGridItem}
                            {replayChartGridItem}
                            {orangeGridItem}
                        </>
                        :
                        <>
                            {blueGridItem}
                            {orangeGridItem}
                            {replayChartGridItem}
                        </>
                    }
                    <Grid item xs={12}>
                        <ReplayContent replay={replay}/>
                    </Grid>
                </Grid>
                }
            </>
        )
    }

    private readonly createListItem = (player: ReplayPlayer) => (
        <ListItem button key={player.name}>
            <ListItemText primary={player.name} primaryTypographyProps={{noWrap: true}}
                          style={{padding: "0 64px 0 0"}}/>
            <ListItemSecondaryAction>
                <IconButton>
                    <FontAwesomeIcon icon={faCarSide}/>
                </IconButton>
                <IconButton>
                    <FontAwesomeIcon icon={faCamera}/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

const styles = createStyles({
    orangeCard: {
        backgroundColor: "bisque"
    },
    blueCard: {
        backgroundColor: "aliceblue"
    }
})

export const ReplayView = withWidth()(withStyles(styles)(ReplayViewComponent))
