import { Tab, Tabs } from "@material-ui/core"
import * as React from "react"

export type UploadTab = "Upload Replays" | "Previous Uploads"
const uploadTabs: UploadTab[] = ["Upload Replays", "Previous Uploads"]

interface Props {
    selectedTab: UploadTab
    handleChange: (event: React.ChangeEvent<{}>, selectedTab: UploadTab) => void
}

export class UploadTabs extends React.PureComponent<Props> {
    public render() {
        return (
            <Tabs value={this.props.selectedTab}
                  onChange={this.props.handleChange}
                  centered
            >
                {uploadTabs.map((uploadTab) =>
                    <Tab label={uploadTab} value={uploadTab} key={uploadTab}/>
                )}
            </Tabs>
        )
    }
}
