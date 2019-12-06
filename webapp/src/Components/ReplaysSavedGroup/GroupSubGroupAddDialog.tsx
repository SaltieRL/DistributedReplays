import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import * as React from "react"
import {addSubgroup} from "../../Requests/Replay"
import {WithNotifications, withNotifications} from "../Shared/Notification/NotificationUtils"

interface OwnProps {
    openDialog: boolean
    onCloseDialog: () => void
    group?: string
}

type Props = OwnProps & WithNotifications

interface State {
    name: string
}

class GroupDialogComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {name: ""}
    }

    public render() {
        return (
            <Dialog
                open={this.props.openDialog}
                onClose={this.props.onCloseDialog}
                scroll="paper"
                PaperProps={{style: {width: 600, maxWidth: "90vw"}}}
            >
                <DialogTitle id="form-dialog-title">Add subgroup</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1} justify="center">
                        <Grid item xs={12} container>
                            <TextField value={this.state.name} onChange={this.handleNameChange} label="Subgroup Name" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.selectReplays} variant={"outlined"}>
                        Add
                    </Button>
                    <Button onClick={this.props.onCloseDialog} variant={"outlined"}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    private readonly handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({name: event.target.value})
    }
    private readonly selectReplays = () => {
        addSubgroup(this.props.group, this.state.name)
        this.props.onCloseDialog()
    }
}

export const GroupSubGroupAddDialog = withNotifications()(GroupDialogComponent)
