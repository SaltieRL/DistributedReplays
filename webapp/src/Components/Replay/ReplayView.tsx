import { Card, CardContent, CardHeader, Grid, IconButton, Tooltip, withWidth } from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import ArrowDownward from "@material-ui/icons/ArrowDownward"
import CloudDownload from "@material-ui/icons/CloudDownload"
import * as React from "react"
import { LOCAL_LINK } from "../../Globals"
import { Replay } from "../../Models"
import { ColouredGameScore } from "../Shared/ColouredGameScore"
import { TagDialogWrapper } from "../Shared/Tag/TagDialogWrapper"
import { ReplayChart } from "./ReplayChart"
import { ReplayTabs } from "./ReplayTabs"
import { ReplayTeamCard } from "./ReplayTeamCard/ReplayTeamCard"

interface OwnProps {
    replay: Replay
    explanations: Record<string, any> | undefined
    handleUpdateTags: (tags: Tag[]) => void
    predictedRanks: any
}

type Props = OwnProps
    & WithWidth

class ReplayViewComponent extends React.PureComponent<Props> {
    public render() {
        const {width, replay, explanations, predictedRanks} = this.props
        const blueCard = <ReplayTeamCard replay={replay} predictedRanks={predictedRanks} isOrange={false}/>
        const orangeCard = <ReplayTeamCard replay={replay} predictedRanks={predictedRanks} isOrange={true}/>

        const downloadButton = (
            <Tooltip title="Download replay">
                <IconButton
                    href={LOCAL_LINK + `/api/replay/${replay.id}/download`}
                    download
                >
                    <CloudDownload/>
                </IconButton>
            </Tooltip>
        )

        const dataExportButton = (
            <Tooltip title="Download data .csv">
                <IconButton
                    href={LOCAL_LINK + `/api/replay/${replay.id}/basic_player_stats/download`}
                    download
                >
                    <ArrowDownward/>
                </IconButton>
            </Tooltip>

        )

        const replayChartCard = (
            <Card>
                <CardHeader
                    title={replay.name ? replay.name : "Unnamed replay"}
                    subheader={<ColouredGameScore replay={replay}/>}
                    titleTypographyProps={{align: "center"}}
                    subheaderTypographyProps={{align: "center", variant: "subheading"}}
                    action={
                        <div style={{position: "relative", width: 0, right: 16, top: 16}}>
                            <div style={{display: "flex", float: "right"}}>
                                <TagDialogWrapper replay={replay} handleUpdateTags={this.props.handleUpdateTags}/>
                                {isWidthUp("sm", width) && dataExportButton}
                                {isWidthUp("sm", width) && downloadButton
                                }
                            </div>
                        </div>}
                />
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
                    <ReplayTabs replay={replay} explanations={explanations} predictedRanks={predictedRanks}/>
                </Grid>
            </Grid>
        )
    }
}

export const ReplayView = withWidth()(ReplayViewComponent)
