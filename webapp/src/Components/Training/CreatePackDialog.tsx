import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import * as moment from "moment"
import * as qs from "qs"
import * as React from "react"
import { doGet } from "../../apiHandler/apiHandler"
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
}

class CreatePackDialogComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            dateStart: null, dateEnd: null, playerId: "", name: ""
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
                    <Grid container spacing={16} style={{paddingTop: 16}}>
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
                        <Grid xs={12}>
                            <TextField value={this.state.playerId}
                                       onChange={this.handlePlayerIdChange}
                                       label="Player ID to use"
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField value={this.state.name}
                                       onChange={this.handleNameChange}
                                       label="Name of pack"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.props.onCloseDialog()
                        this.createPack()
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
            player_id: this.state.playerId !== "" ? this.state.playerId.substr(0, 40) : undefined,
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
        this.setState({playerId: event.target.value})
    }
    private readonly handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({name: event.target.value})
    }

}

export const CreatePackDialog = withNotifications()(CreatePackDialogComponent)
