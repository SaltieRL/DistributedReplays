import { Card, Divider, Grid } from "@material-ui/core"
import * as React from "react"
import { PreviousUploads } from "../Shared/Upload/PreviousUploads"
import { UploadForm } from "../Shared/Upload/UploadForm"
import { UploadTab, UploadTabs } from "../Shared/Upload/UploadTabs"
import { BasePage } from "./BasePage"

interface State {
    selectedTab: UploadTab
}

export class UploadPage extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {selectedTab: "Upload Replays"}
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={16} alignItems="center" justify="center">
                    <Grid item>
                        <Card style={{width: 600, maxWidth: "90vw"}}>
                            <UploadTabs selectedTab={this.state.selectedTab} handleChange={this.handleTabChange}/>
                            <Divider/>
                            {this.state.selectedTab === "Upload Replays" ?
                                <UploadForm/>
                                :
                                <PreviousUploads/>
                            }
                        </Card>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly handleTabChange = (_: React.ChangeEvent<{}>, selectedTab: UploadTab) => {
        this.setState({selectedTab})
    }
}
