import { Grid } from "@material-ui/core"
import React, { Component } from "react"
import {
    FieldCameraControls,
    FPSClock,
    GameManager,
    PlayControls,
    PlayerCameraControls,
    ReplayViewer,
    Slider
} from "replay-viewer"

import { Replay } from "../../../Models"
import { getReplayMetadata, getReplayViewerData } from "../../../Requests/Replay"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"

interface Props {
    replayId: Replay["id"]
}

interface State {
    gameManager?: GameManager
}

export class Viewer extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    public render() {
        const { gameManager } = this.state

        return (
            <LoadableWrapper load={this.getReplayData}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    spacing={24}
                    style={{ padding: 32 }}
                >
                    <Grid item style={{ minHeight: 0, width: "100%" }}>
                        <ReplayViewer gameManager={gameManager!} />
                    </Grid>
                    <Grid item>
                        <Grid container justify="space-between" alignItems="center" spacing={24}>
                            <Grid item>
                                <PlayControls />
                            </Grid>
                            <Grid item>
                                <FieldCameraControls />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <PlayerCameraControls />
                    </Grid>
                    <Grid item>
                        <Slider />
                    </Grid>
                </Grid>
            </LoadableWrapper>
        )
    }

    private readonly getReplayData = async () => {
        const { replayId } = this.props
        return Promise.all([getReplayViewerData(replayId), getReplayMetadata(replayId)])
            .then(([replayData, replayMetadata]) => {
                return GameManager.builder({
                    clock: FPSClock.convertReplayToClock(replayData),
                    replayData,
                    replayMetadata
                })
            })
            .then((gameManager) => this.setState({ gameManager }))
    }
}
