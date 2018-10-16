import * as React from "react"
import { Replay } from "src/Models"

export namespace ColouredGameScore {
    export interface Props {
        replay: Replay
    }
}

export class ColouredGameScore extends React.PureComponent<ColouredGameScore.Props> {
    public render() {
        return (
            <>
                <span style={{ color: "blue" }}>{this.props.replay.gameScore.team0Score}</span>
                {" - "}
                <span style={{ color: "orange" }}>{this.props.replay.gameScore.team1Score}</span>
            </>
        )
    }
}
