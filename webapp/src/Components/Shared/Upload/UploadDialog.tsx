import { Dialog, DialogTitle, Divider } from "@material-ui/core"
import * as React from "react"
import { PreviousUploads } from "./PreviousUploads"
import { UploadForm } from "./UploadForm"
import { UploadTab, UploadTabs } from "./UploadTabs"

interface Props {
    open: boolean,
    handleClickOutside: () => void
}

interface State {
    selectedTab: UploadTab
}

export class UploadDialog extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Upload Replays"}
    }

    public render() {
        return (
            <Dialog open={this.props.open}
                    onClose={this.props.handleClickOutside}
                    scroll="paper"
                    PaperProps={
                        {style: {width: 600, maxWidth: "90vw"}}}>
                <DialogTitle style={{padding: 0}}>
                    <UploadTabs selectedTab={this.state.selectedTab} handleChange={this.handleTabChange}/>
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

    private readonly handleTabChange = (_: React.ChangeEvent<{}>, selectedTab: UploadTab) => {
        this.setState({selectedTab})
    }
}
