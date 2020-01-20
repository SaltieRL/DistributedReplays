import * as React from "react"
import {ThemeContext} from "../../Contexts/ThemeContext"
import {CompactReplay, Replay } from "../../Models"

interface Props {
    replay: Replay | CompactReplay
}

export class ColouredGameScore extends React.PureComponent<Props> {
    public render() {
        return (
            <ThemeContext.Consumer>
                {(themeValue) => (
                    <>
                        <span style={{color: themeValue.blueColor}}>{this.props.replay.gameScore.team0Score}</span>
                        {" - "}
                        <span style={{color: themeValue.orangeColor}}>{this.props.replay.gameScore.team1Score}</span>
                    </>
                )}
            </ThemeContext.Consumer>
        )
    }
}
