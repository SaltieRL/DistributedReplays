import {Card, CardContent, CardHeader, Grid, withWidth} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {getColouredGameScore, Replay} from "../../Models/Replay/Replay"
import {ReplayChart} from "./ReplayChart"
import {ReplayContent} from "./ReplayContent"
import {ReplayTeamCard} from "./ReplayTeamCard/ReplayTeamCard"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps
    & WithWidth

class ReplayViewComponent extends React.PureComponent<Props> {
    public render() {
        const replay = this.props.replay
        const blueCard = <ReplayTeamCard replay={replay} isOrange={false}/>
        const orangeCard = <ReplayTeamCard replay={replay} isOrange={true}/>

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
            <Grid item xs={12} sm={6} lg={3}>
                {blueCard}
            </Grid>
        const replayChartGridItem =
            <Grid item xs={12} lg={6}>
                {replayChartCard}
            </Grid>
        const orangeGridItem =
            <Grid item xs={12} sm={6} lg={3}>
                {orangeCard}
            </Grid>

        return (
            <Grid item xs={12} container spacing={24} alignItems="center">
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
        )
    }
}

export const ReplayView = withWidth()(ReplayViewComponent)
