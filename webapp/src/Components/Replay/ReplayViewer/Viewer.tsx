import { Grid } from "@material-ui/core"
import React, { Component } from "react"
import {
    FieldCameraControls,
    FPSClock,
    GameBuilderOptions,
    GameManager,
    GameManagerLoader,
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
    options?: GameBuilderOptions
    gameManager?: GameManager
}

export class Viewer extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    public renderGrid() {
        const { gameManager } = this.state

        if (!gameManager) {
            const issue = "There was an issue loading the replay viewer"
            const tryAgain =
                "Try again and if this keeps happening, contact us over one of the channels below"
            return [issue, tryAgain].join(". ")
        }

        return (
            <Grid
                container
                direction="column"
                justify="center"
                spacing={24}
                style={{ padding: 32 }}
            >
                <Grid item style={{ minHeight: 0, width: "100%" }}>
                    <ReplayViewer gameManager={gameManager} />
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
        )
    }

    public render() {
        const { options } = this.state
        const onLoad = (gm: GameManager) => this.setState({ gameManager: gm })

        return (
            <LoadableWrapper load={this.getReplayData}>
                <GameManagerLoader options={options!} onLoad={onLoad}>
                    {this.renderGrid()}
                </GameManagerLoader>
            </LoadableWrapper>
        )
    }

    private readonly getReplayData = () => {
        const { replayId } = this.props
        return Promise.all([getReplayViewerData(replayId), getReplayMetadata(replayId)]).then(
            ([replayData, replayMetadata]) => {
                this.setState({
                    options: {
                        clock: FPSClock.convertReplayToClock(replayData),
                        replayData,
                        replayMetadata
                    }
                })
            }
        )
    }
}
