import {
    DialogActions,
    DialogContent,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@material-ui/core"
import Refresh from "@material-ui/icons/Refresh"
import * as React from "react"
import {getUploadStatuses} from "../../../Requests/Global"
import {getPreviousUploads, UploadTask} from "./StatusUtils"

interface State {
    uploadTasks: UploadTask[]
    uploadStatuses?: UploadStatus[]
}

export class PreviousUploads extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {uploadTasks: []}
    }

    public componentDidMount() {
        this.getUploadStatuses()
    }

    public render() {
        return (
            <>
                <DialogContent>
                    <div style={{padding: 16}}>
                        <Grid container spacing={16} justify="center">
                            {this.state.uploadTasks.length === 0 ?
                                <Grid item xs="auto">
                                    <Typography align="center">
                                        <i>No previous uploads found.</i>
                                    </Typography>
                                    <Typography variant="caption">
                                        NB. Upload tasks are associated with session and not user.
                                    </Typography>
                                </Grid>
                                :
                                (this.state.uploadStatuses) &&
                                (this.state.uploadStatuses.length === this.state.uploadTasks.length) ?
                                    <List>
                                        {this.state.uploadTasks
                                            .sort((a, b) => b.dateCreated.diff(a.dateCreated))
                                            .map((uploadTask, i) => (
                                                <ListItem key={uploadTask.id}>
                                                    <ListItemText
                                                        primary={
                                                            `Upload on ${uploadTask.dateCreated.format("lll")}:  ` +
                                                            `${this.state.uploadStatuses![i].toLowerCase()}`
                                                        }
                                                        secondary={uploadTask.id}
                                                    />
                                                </ListItem>
                                            ))}
                                    </List>
                                    :
                                    <Typography>
                                        <i>Loading</i>
                                    </Typography>

                            }
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={this.getUploadStatuses}>
                        <Refresh/>
                    </IconButton>
                </DialogActions>
            </>
        )
    }

    private readonly getUploadStatuses = () => {
        const uploadTasks = getPreviousUploads()
        if (uploadTasks.length > 0) {
            getUploadStatuses(uploadTasks.map((uploadTask) => uploadTask.id))
                .then((uploadStatuses) => this.setState({uploadStatuses, uploadTasks}))
        }
    }
}
