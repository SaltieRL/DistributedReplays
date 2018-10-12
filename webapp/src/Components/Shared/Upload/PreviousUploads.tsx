import {DialogContent, Grid, List, ListItem, ListItemText, Typography} from "@material-ui/core"
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
        this.state = {uploadTasks: getPreviousUploads()}
    }

    public componentDidMount() {
        getUploadStatuses(this.state.uploadTasks.map((uploadTask) => uploadTask.id))
            .then((uploadStatuses) => this.setState({uploadStatuses}))
    }

    public render() {
        return (
            <DialogContent>
                <div style={{padding: 16}}>
                    <Grid container spacing={16}>
                        {this.state.uploadTasks.length === 0 ?
                            <Typography>
                                No previous uploads found.
                            </Typography>
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
        )
    }
}
