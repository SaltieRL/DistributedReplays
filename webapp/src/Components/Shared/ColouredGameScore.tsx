import * as React from "react"
import { Replay } from "../../Models"

export interface Props {
    replay: Replay
}

export class ColouredGameScore extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <span style={{color: "blue"}}>{this.props.replay.gameScore.team0Score}</span>
                {" - "}
                <span style={{color: "orange"}}>{this.props.replay.gameScore.team1Score}</span>
            </>
        )
    }
}
