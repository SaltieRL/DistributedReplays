import { Card, CardHeader, Divider, List, Typography, withWidth } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import * as _ from "lodash"
import * as moment from "moment"
import * as React from "react"
import { doGet } from "../../apiHandler/apiHandler"
import { TrainingPack, TrainingPackResponse, TrainingPackShot } from "../../Models/Player/TrainingPack"
import { Viewer } from "../Replay/ReplayViewer/Viewer"
import { ClearableDatePicker } from "../Shared/ClearableDatePicker"
import { withNotifications, WithNotifications } from "../Shared/Notification/NotificationUtils"
import { TrainingPackDisplayRow } from "./TrainingPackDisplayRow"
import { TrainingPackTablePagination } from "./TrainingPackTablePagination"

interface OwnProps {
    trainingPacks: TrainingPackResponse
    page: number
    limit: number
}

type Props = OwnProps
    & WithNotifications
    & WithWidth

interface State {
    selectable: boolean
    selectedReplayIds: string[]
    game?: string
    frame?: number
    date: moment.Moment | null
}

class TrainingPackResultDisplayComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectable: false, selectedReplayIds: [], date: null}
    }

    public render() {
        const {width} = this.props
        const isWidthUpLg = isWidthUp("lg", width)
        const linkButton = (
            <Button onClick={this.createPack} variant={"outlined"}>
                Create pack
            </Button>
        )
        const viewer = (this.state.game && this.state.frame) ? (
            <Grid item xs={isWidthUpLg ? 5 : 12} style={{minHeight: "40vh"}}>
                <Viewer replayId={this.state.game}
                        frameMin={this.state.frame}
                        frameCount={150}
                        pauseOnStart={true}
                />
            </Grid>
        ) : null
        const {trainingPacks, page, limit} = this.props
        const {selectable} = this.state
        return (
            <Grid container>
                <Grid item xs={(this.state.game && isWidthUpLg) ? 7 : 12}>
                    {!isWidthUpLg && viewer
                    }
                    {trainingPacks.packs.length > 0 ?
                        <Card>
                            <CardHeader title="Training Packs"
                                        subheader={"Packs can be placed in " +
                                        "Documents\\My Games\\Rocket League\\TAGame\\Training\\[id]\\MyTraining " +
                                        "and accessed in Training > Created"} action={
                                <div style={{paddingRight: 8}}>
                                    <div style={{display: "flex"}}>
                                        <ClearableDatePicker
                                            placeholder={"Date filter"}
                                            onChange={this.handleDateChange}
                                            value={this.state.date}
                                            helperText="Leave blank to default to recent games"/>
                                        {linkButton}
                                    </div>
                                </div>}/>
                            {selectable ?
                                <List dense style={isWidthUpLg ? {} : {overflowY: "scroll", height: "50vh"}}>
                                    <Divider/>
                                    {this.props.trainingPacks.packs.map((pack: TrainingPack, i) =>
                                        <>
                                            <TrainingPackDisplayRow
                                                key={pack.guid}
                                                pack={pack}
                                                selectProps={{
                                                    selected: _.includes(
                                                        this.state.selectedReplayIds,
                                                        pack.guid
                                                    ),
                                                    handleSelectChange: this.handleSelectChange(pack.guid)
                                                }}
                                                selectShotHandler={(shotNum: number) => {
                                                    this.handleSelectShot(i, shotNum)
                                                }}/>
                                            {!(i === this.props.trainingPacks.packs.length) && <Divider/>}
                                        </>
                                    )}
                                </List>
                                :
                                <div style={isWidthUpLg ? {} : {overflowY: "scroll", height: "30vh"}}>
                                    {this.props.trainingPacks.packs.map((pack: TrainingPack, i) =>
                                        <TrainingPackDisplayRow
                                            key={pack.guid}
                                            pack={pack}
                                            selectShotHandler={(shotNum: number) => {
                                                this.handleSelectShot(i, shotNum)
                                            }}
                                        />
                                    )
                                    }
                                </div>
                            }
                            <TrainingPackTablePagination
                                totalCount={trainingPacks.totalCount}
                                page={page}
                                limit={limit}/>
                        </Card>
                        :
                        <Typography variant="subtitle1" align="center">
                            <i>No training packs exist.</i>
                            {linkButton}
                        </Typography>
                    }
                </Grid>
                {isWidthUpLg && viewer}
            </Grid>
        )
    }

    private readonly handleSelectShot = (pack: number, shotNumber: number) => {
        console.log(pack, shotNumber)
        const shot: TrainingPackShot = this.props.trainingPacks.packs[pack].shots[shotNumber]
        this.setState({game: shot.game, frame: shot.frame})
    }
    // private readonly handleSelectableChange = (event: React.ChangeEvent<HTMLInputElement>,
    //                                            selectable: boolean) => {
    //     this.setState({selectable})
    //     if (!selectable) {
    //         this.setState({
    //             selectedReplayIds: []
    //         })
    //     }
    // }

    private readonly handleSelectChange = (id: string) => (checked: boolean) => {
        if (!checked) {
            this.setState({
                selectedReplayIds: this.state.selectedReplayIds.filter((replayId) => replayId !== id)
            })
        } else {
            this.setState({
                selectedReplayIds: [...this.state.selectedReplayIds, id]
            })
        }
    }

    private readonly createPack = () => {
        doGet("/training/create" + (this.state.date ? "?date=" + this.state.date.unix() : ""))
            .then(() => {
                this.props.showNotification({
                    variant: "success",
                    message: "Successfully created! Give up to a minute for generation to complete",
                    timeout: 5000
                })
            })
    }

    private readonly handleDateChange = (date: moment.Moment | null) => {
        this.setState({date})
    }

    // private readonly getGroupLink = () => {
    //     const url = qs.stringify({ids: this.state.selectedReplayIds},
    //         {arrayFormat: "repeat", addQueryPrefix: true})
    //     return REPLAYS_GROUP_PAGE_LINK + url
    // }
}

export const TrainingPackResultDisplay = withWidth()(withNotifications()(TrainingPackResultDisplayComponent))
