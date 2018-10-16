import { Grid, Modal } from "@material-ui/core"
import * as React from "react"
import { UploadForm } from "./UploadForm"

interface Props {
    open: boolean
    handleClickOutside: () => void
}

export class UploadModal extends React.PureComponent<Props> {
    public render() {
        const spacer = <Grid item xs={1} sm={2} lg={3} xl={4} onClick={this.props.handleClickOutside} />

        return (
            <Modal open={this.props.open} onClose={this.props.handleClickOutside}>
                <Grid
                    container
                    justify="center"
                    alignItems="stretch"
                    style={{
                        position: "relative",
                        top: "50%",
                        transform: "translateY(-50%)",
                        outline: "none"
                    }}
                >
                    {spacer}
                    <Grid item>
                        <UploadForm />
                    </Grid>
                    {spacer}
                </Grid>
            </Modal>
        )
    }
}
