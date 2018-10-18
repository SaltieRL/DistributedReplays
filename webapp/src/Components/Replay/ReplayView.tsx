import { Card, CardContent, CardHeader, Grid, IconButton, Tooltip, withWidth } from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import CloudDownload from "@material-ui/icons/CloudDownload"
import * as React from "react"
import { LOCAL_LINK } from "../../Globals"
import { getColouredGameScore, Replay } from "../../Models/Replay/Replay"
import { ReplayChart } from "./ReplayChart"
import { ReplayTabs } from "./ReplayTabs"
import { ReplayTeamCard } from "./ReplayTeamCard/ReplayTeamCard"

interface OwnProps {
    replay: Replay
}

type Props = OwnProps
    & WithWidth

class ReplayViewComponent extends React.PureComponent<Props> {
    public render() {
        const {width, replay} = this.props
        const blueCard = <ReplayTeamCard replay={replay} isOrange={false}/>
        const orangeCard = <ReplayTeamCard replay={replay} isOrange={true}/>

        const downloadButton = (
            <Tooltip title="Download replay">
                <IconButton style={{position: "absolute", right: 16, top: 16}}
                            href={LOCAL_LINK + `/api/replay/${replay.id}/download`}
                            download
                >
                    <CloudDownload/>
                </IconButton>
            </Tooltip>
        )
        const replayChartCard = (
            <Card>
                <CardHeader title={replay.name ? replay.name : "Unnamed replay"}
                            subheader={getColouredGameScore(replay)}
                            titleTypographyProps={{align: "center"}}
                            subheaderTypographyProps={{align: "center", variant: "subheading"}}
                            action={isWidthUp("sm", width) &&
                            <div style={{position: "relative", width: 0}}>{downloadButton}</div>
                            }/>
                <CardContent style={{overflowX: "auto"}}>
                    <ReplayChart replay={replay}/>
                </CardContent>
            </Card>
        )
        const blueGridItem = (
            <Grid item xs={12} sm={6} lg={3}>
                {blueCard}
            </Grid>
        )
        const replayChartGridItem = (
            <Grid item xs={12} lg={6}>
                {replayChartCard}
            </Grid>
        )
        const orangeGridItem = (
            <Grid item xs={12} sm={6} lg={3}>
                {orangeCard}
            </Grid>
        )

        return (
            <Grid item xs={12} container spacing={24} alignItems="center">
                {isWidthUp("lg", width) ?
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
                    <ReplayTabs replay={replay}/>
                </Grid>
            </Grid>
        )
    }
}

export const ReplayView = withWidth()(ReplayViewComponent)
