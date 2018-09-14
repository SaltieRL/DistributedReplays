import {Grid} from "@material-ui/core"
import * as React from "react"
import {UploadForm} from "../Shared/Upload/UploadForm"
import {BasePage} from "./BasePage"


export class UploadPage extends React.PureComponent {
    public render() {
        return (
            <BasePage>
                <Grid container spacing={16} alignItems="center" justify="center">
                    <Grid item>
                        <UploadForm/>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}
