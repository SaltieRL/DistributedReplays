import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField, Typography
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import CheckIcon from "@material-ui/icons/Check"
import ClearIcon from "@material-ui/icons/Clear"
import * as moment from "moment"
import * as qs from "qs"
import * as React from "react"
import { doGet } from "../../apiHandler/apiHandler"
import { getPlayer } from "../../Requests/Player/getPlayer"
import { resolvePlayerNameOrId } from "../../Requests/Player/resolvePlayerNameOrId"
import { ClearableDatePicker } from "../Shared/ClearableDatePicker"
import { WithNotifications, withNotifications } from "../Shared/Notification/NotificationUtils"

interface OwnProps {
    openDialog: boolean
    onCloseDialog: () => void
}

type Props = OwnProps
    & WithNotifications

interface State {
    dateStart: moment.Moment | null
    dateEnd: moment.Moment | null
    playerId: string
    name: string
    timer?: NodeJS.Timeout
    loading: boolean
    player?: Player
}

class CreatePackDialogComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            dateStart: null, dateEnd: null, playerId: "", name: "", loading: false
        }
    }

    public render() {
        return (
            <Dialog open={this.props.openDialog}
                    onClose={this.props.onCloseDialog}
                    scroll="paper"
                    PaperProps={
                        {style: {width: 600, maxWidth: "90vw"}}}>
                <DialogTitle id="form-dialog-title">Create pack</DialogTitle>
                <DialogContent>
                    <Grid container spacing={8} style={{paddingTop: 8}}>
                        <Grid item xs={12}>
                            <DialogContentText>
                                Leave all fields blank for defaults (use most recent games).
                            </DialogContentText>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField value={this.state.name}
                                       onChange={this.handleNameChange}
                                       label="Name of pack"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ClearableDatePicker
                                placeholder={"Date filter start"}
                                onChange={this.handleDateChangeStart}
                                value={this.state.dateStart}
                                helperText="Leave blank to default to recent games"/>
                        </Grid>
                        <Grid item xs={12}>
                            <ClearableDatePicker
                                placeholder={"Date filter end"}
                                onChange={this.handleDateChangeEnd}
                                value={this.state.dateEnd}
                                helperText="Leave blank to default to recent games"/>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={6}>
                                <TextField value={this.state.playerId}
                                           onChange={this.handlePlayerIdChange}
                                           label="Player ID or custom URL"
                                />
                            </Grid>
                            <Grid container item xs={6}>
                                {this.state.loading && <Grid xs={12}>
                                    <CircularProgress/>
                                </Grid>}
                                {this.state.player && !this.state.loading && <>
                                    <Grid item xs={4}>
                                        <CheckIcon style={{
                                            color: "#00ff00",
                                            height: 40
                                        }}/>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <img alt={"Player profile"} src={this.state.player.avatarLink} height={40}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">{this.state.player.name}</Typography>
                                    </Grid>
                                </>}
                            </Grid>
                            {!this.state.player && this.state.playerId && !this.state.loading && <ClearIcon style={{
                                color: "#ff0000",
                                height: 40
                            }}/>}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        if (this.state.dateStart !== null || this.state.dateEnd !== null) {
                            if (this.state.dateStart == null || this.state.dateEnd == null) {
                                this.props.showNotification({
                                    variant: "error",
                                    message: "Date start and end must both have values or be empty!",
                                    timeout: 5000
                                })
                                return
                            }
                        }
                        if ((this.state.player || !this.state.playerId) && !this.state.loading) {
                            this.props.onCloseDialog()
                            this.createPack()
                        }
                    }} variant={"outlined"}>
                        Create pack
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    private readonly createPack = () => {
        const params = {
            date_start: this.state.dateStart ? this.state.dateStart.unix() : undefined,
            date_end: this.state.dateEnd ? this.state.dateEnd.unix() : undefined,
            player_id: this.state.player ? this.state.player.id.substr(0, 40) : undefined,
            name: this.state.name !== "" ? this.state.name.substr(0, 100) : undefined
        }
        doGet("/training/create" + qs.stringify(params, {addQueryPrefix: true}))
            .then(() => {
                this.props.showNotification({
                    variant: "success",
                    message: "Successfully queued! Give up to a minute for generation to complete",
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

    private readonly handlePlayerIdChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (this.state.timer) {
            clearTimeout(this.state.timer)
        }
        this.setState({player: undefined, playerId: event.target.value, loading: true}, () => {
            this.setState({
                timer: setTimeout(() => {
                    this.getPlayerByNameOrId(this.state.playerId)
                }, 750)
            })
        })
    }
    private readonly handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({name: event.target.value})
    }

    private readonly getPlayerByNameOrId = (id: string) => {
        resolvePlayerNameOrId(id).then(getPlayer).then((result) => {
            this.setState({loading: false, player: result})
        }).catch(() => {
            this.setState({loading: false})
        })
    }

}

export const CreatePackDialog = withNotifications()(CreatePackDialogComponent)
