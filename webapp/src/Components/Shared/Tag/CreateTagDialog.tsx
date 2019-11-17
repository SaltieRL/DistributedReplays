import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField } from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import * as React from "react"
import { createTag } from "../../../Requests/Tag"
import { withNotifications, WithNotifications } from "../Notification/NotificationUtils"

interface OwnProps {
    onCreate: (tag: Tag) => void
}

type Props = OwnProps
    & WithNotifications

interface State {
    open: boolean
    name: string
}

class CreateTagDialogComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            open: false,
            name: ""
        }
    }

    public render() {
        return (
            <>
                <Fab
                    size="small"
                    onClick={this.handleOpen}
                    style={{position: "absolute", bottom: 16, right: 16}}
                    color="secondary"
                >
                    <Add/>
                </Fab>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    scroll="paper"
                    PaperProps={{style: {width: 600, maxWidth: "90vw"}}}
                >
                    <DialogTitle>
                        Create tag
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleFormSubmit}>
                            <TextField
                                label="Name"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                                helperText="Only letters, numbers, and underscores are accepted."
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={this.handleCreate}>
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }

    private readonly handleOpen = () => {
        this.setState({open: true})
    }

    private readonly handleClose = () => {
        this.setState({open: false})
    }

    private readonly handleFormSubmit: React.FormEventHandler = (event) => {
        event.preventDefault()
        this.handleCreate()
    }

    private readonly handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const filteredValue = event.target.value.replace(/[^\w]+/g, "")
        this.setState({name: filteredValue})
    }

    private readonly handleCreate = () => {
        const enteredTagName = this.state.name
        if (enteredTagName.length > 0) {
            createTag(enteredTagName)
                .then(this.props.onCreate)
                .then(() => this.props.showNotification({
                    variant: "success",
                    message: `Created tag: ${enteredTagName}`
                }))
                .then(() => this.setState(
                    {
                        name: "",
                        open: false
                    })
                )
        }
    }
}

export const CreateTagDialog = withNotifications()(CreateTagDialogComponent)
