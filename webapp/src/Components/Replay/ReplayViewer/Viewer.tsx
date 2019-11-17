import { Grid } from "@material-ui/core"
import React, { Component } from "react"
import {
    CompactPlayControls,
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
import { getReplayMetadata, getReplayViewerData, getReplayViewerDataRange } from "../../../Requests/Replay"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"

interface Props {
    replayId: Replay["id"]
    frameMin?: number
    frameCount?: number
    pauseOnStart?: boolean
    compact?: boolean
}

interface State {
    options?: GameBuilderOptions
    gameManager?: GameManager
    reloadSignal: boolean
}

export class Viewer extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.replayId !== this.props.replayId || prevProps.frameMin !== this.props.frameMin) {
            this.setState({reloadSignal: !this.state.reloadSignal})
        }
    }

    public renderGrid() {
        const {gameManager} = this.state

        if (!gameManager) {
            const issue = "There was an issue loading the replay viewer"
            const tryAgain =
                "Try again and if this keeps happening, contact us over one of the channels below"
            return [issue, tryAgain].join(". ")
        }
        if (this.props.pauseOnStart) {
            setTimeout(() => {
                gameManager.clock.pause()
            }, 200)
        }
        return (
            <Grid
                container
                direction="column"
                justify="center"
                spacing={3}
                style={{padding: 32}}
            >
                <Grid item style={{minHeight: 0, width: "100%"}}>
                    <ReplayViewer gameManager={gameManager}>
                        <CompactPlayControls/>
                    </ReplayViewer>
                </Grid>
                {!this.props.compact &&
                <>
                    <Grid item>
                        <Grid container justify="space-between" alignItems="center" spacing={3}>
                            <Grid item>
                                <PlayControls/>
                            </Grid>
                            <Grid item>
                                <FieldCameraControls/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <PlayerCameraControls/>
                    </Grid>
                    <Grid item>
                        <Slider/>
                    </Grid>
                </>
                }
            </Grid>
        )
    }

    public render() {
        const {options} = this.state
        const onLoad = (gm: GameManager) => this.setState({gameManager: gm})

        return (
            <LoadableWrapper load={this.getReplayData} reloadSignal={this.state.reloadSignal}>
                <GameManagerLoader options={options!} onLoad={onLoad}>
                    {this.renderGrid()}
                </GameManagerLoader>
            </LoadableWrapper>
        )
    }

    private readonly getReplayData = () => {
        const {replayId} = this.props
        let dataPromise
        if (this.props.frameMin && this.props.frameCount) {
            dataPromise = getReplayViewerDataRange(replayId, this.props.frameMin, this.props.frameCount)
        } else {
            dataPromise = getReplayViewerData(replayId)
        }
        return Promise.all([dataPromise, getReplayMetadata(replayId)]).then(
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
