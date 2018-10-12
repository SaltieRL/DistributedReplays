import {Grid, Modal, Paper, Tab, Tabs} from "@material-ui/core"
import * as React from "react"
import {PreviousUploads} from "./PreviousUploads"
import {UploadForm} from "./UploadForm"

interface Props {
    open: boolean,
    handleClickOutside: () => void
}

type UploadTab = "Upload Replays" | "Previous Uploads"
const uploadTabs: UploadTab[] = ["Upload Replays", "Previous Uploads"]

interface State {
    selectedTab: UploadTab
}

export class UploadModal extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Upload Replays"}
    }

    public render() {
        const spacer = <Grid item xs={1} sm={2} lg={3} xl={4} onClick={this.props.handleClickOutside}/>

        return (
            <Modal open={this.props.open} onClose={this.props.handleClickOutside}>
                <Grid container justify="center" alignItems="stretch" style={{
                    position: "relative",
                    top: "50%",
                    transform: "translateY(-50%)",
                    outline: "none"
                }}>
                    {spacer}
                    <Grid item>
                        <Paper>
                            <Tabs value={this.state.selectedTab}
                                  onChange={this.handleTabChange}
                                  centered
                            >
                                {uploadTabs.map((uploadTab) =>
                                    <Tab label={uploadTab} value={uploadTab} key={uploadTab}/>
                                )}
                            </Tabs>
                            {this.state.selectedTab === "Upload Replays" ?
                                <UploadForm/>
                                :
                                <PreviousUploads/>
                            }
                        </Paper>
                    </Grid>
                    {spacer}
                </Grid>
            </Modal>
        )
    }

    private readonly handleTabChange = (event: React.ChangeEvent, selectedTab: UploadTab) => {
        this.setState({selectedTab})
    }
}
