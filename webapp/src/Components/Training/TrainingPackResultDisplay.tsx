import {
    Card,
    CardHeader,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    List,
    Typography,
    withWidth
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import * as _ from "lodash"
import * as moment from "moment"
import * as qs from "qs"
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
    dateStart: moment.Moment | null
    dateEnd: moment.Moment | null
    openDialog: boolean
}

class TrainingPackResultDisplayComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectable: false, selectedReplayIds: [], dateStart: null, dateEnd: null, openDialog: false}
    }

    public render() {
        const {width} = this.props
        const isWidthUpLg = isWidthUp("lg", width)
        const linkButton = (
            <Button onClick={this.openDialog} variant={"outlined"}>
                New pack
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

        const createPackDialog = (
            <Dialog open={this.state.openDialog}
                    onClose={this.closeDialog}
                    scroll="paper"
                    PaperProps={
                        {style: {width: 600, maxWidth: "90vw"}}}>
                <DialogTitle id="form-dialog-title">Create pack</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid xs={12}>
                            <DialogContentText>
                                Leave all fields blank for defaults (use most recent games).
                            </DialogContentText>
                        </Grid>
                        <Grid xs={12}>
                            <ClearableDatePicker
                                placeholder={"Date filter start"}
                                onChange={this.handleDateChangeStart}
                                value={this.state.dateStart}
                                helperText="Leave blank to default to recent games"/>
                        </Grid>
                        <Grid xs={12}>
                            <ClearableDatePicker
                                placeholder={"Date filter end"}
                                onChange={this.handleDateChangeEnd}
                                value={this.state.dateEnd}
                                helperText="Leave blank to default to recent games"/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.closeDialog()
                        this.createPack()
                    }} variant={"outlined"}>
                        Create pack
                    </Button>
                </DialogActions>
            </Dialog>
        )

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
                {createPackDialog}
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
        const params = {
            date_start: this.state.dateStart ? this.state.dateStart.unix() : undefined,
            date_end: this.state.dateEnd ? this.state.dateEnd.unix() : undefined
        }
        doGet("/training/create" + qs.stringify(params, {addQueryPrefix: true}))
            .then(() => {
                this.props.showNotification({
                    variant: "success",
                    message: "Successfully created! Give up to a minute for generation to complete",
                    timeout: 5000
                })
            })
    }

    private readonly handleDateChangeStart = (date: moment.Moment | null) => {
        this.setState({dateStart: date})
    }
    private readonly handleDateChangeEnd = (date: moment.Moment | null) => {
        this.setState({dateEnd: date})
    }

    private readonly closeDialog = () => {
        this.setState({openDialog: false})
    }
    private readonly openDialog = () => {
        this.setState({openDialog: true})
    }
}

export const TrainingPackResultDisplay = withWidth()(withNotifications()(TrainingPackResultDisplayComponent))
