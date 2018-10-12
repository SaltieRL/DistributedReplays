import {Dialog, DialogTitle, Divider, Tab, Tabs} from "@material-ui/core"
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
        return (
            <Dialog open={this.props.open}
                    onClose={this.props.handleClickOutside}
                    scroll="paper">
                <DialogTitle style={{padding: 0}}>
                    <Tabs value={this.state.selectedTab}
                          onChange={this.handleTabChange}
                          centered
                    >
                        {uploadTabs.map((uploadTab) =>
                            <Tab label={uploadTab} value={uploadTab} key={uploadTab}/>
                        )}
                    </Tabs>
                    <Divider/>
                </DialogTitle>
                    {this.state.selectedTab === "Upload Replays" ?
                        <UploadForm/>
                        :
                        <PreviousUploads/>
                    }
            </Dialog>

        )
    }

    private readonly handleTabChange = (event: React.ChangeEvent, selectedTab: UploadTab) => {
        this.setState({selectedTab})
    }
}
