import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core"
import * as React from "react"
import { Link } from "react-router-dom"
import { TAGS_PAGE_LINK } from "../../../Globals"

interface Props {
    open: boolean
    toggleExternalKeyDialog: () => void
    addExternalPrivateKey: (privateKey: string) => void
}

interface State {
    enteredExternalPrivateKey: string
}

export class AddTagPrivateKeyDialog extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {enteredExternalPrivateKey: ""}
    }

    public render() {
        return (
            <Dialog
                open={this.props.open}
                onBackdropClick={this.props.toggleExternalKeyDialog}
                maxWidth="xs"
            >
                <DialogTitle>Add Tag by Private Key</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add private keys to upload replays to a tag belonging to another user.
                        {" Private keys can be found at the "}
                        {<Link to={TAGS_PAGE_LINK}>
                            tags page
                        </Link>}
                        .
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Private Key"
                        value={this.state.enteredExternalPrivateKey}
                        onChange={this.handleExternalPrivateKeyChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.addPrivateKey}>
                        Add Key
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    private readonly handleExternalPrivateKeyChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({enteredExternalPrivateKey: event.target.value})
    }

    private readonly addPrivateKey = () => {
        this.setState({enteredExternalPrivateKey: ""})
        this.props.addExternalPrivateKey(this.state.enteredExternalPrivateKey)
    }
}
