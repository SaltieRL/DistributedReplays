import React, { Component } from "react"
import { FPSClock, GameManager, ReplayViewer } from "replay-viewer"

import { Replay } from "../../../Models"
import { getReplayViewerData } from "../../../Requests/Replay"

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

    public componentDidMount() {
        this.getReplayData()
    }

    public render() {
        const { gameManager } = this.state
        if (!gameManager) {
            return <div>Loading!</div>
        }
        return <ReplayViewer gameManager={gameManager} />
    }

    private readonly getReplayData = () => {
        const { replayId } = this.props
        Promise.all([getReplayViewerData(replayId)])
            .then(([replayData, replayMetadata]) => {
                return GameManager.builder({
                    clock: FPSClock.convertReplayToClock(replayData),
                    replayData,
                    replayMetadata: {} as any
                })
            })
            .then((gameManager) => this.setState({ gameManager }))
    }
}
