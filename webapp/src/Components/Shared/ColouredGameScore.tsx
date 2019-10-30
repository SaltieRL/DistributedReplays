import { WithTheme, withTheme } from "@material-ui/core"
import * as React from "react"
import { CompactReplay, Replay } from "../../Models"

interface OwnProps {
    replay: Replay | CompactReplay
}

type Props = OwnProps & WithTheme

class ColouredGameScoreComponent extends React.PureComponent<Props> {
    public render() {
        const isDarkTheme = this.props.theme.palette.type === "dark"
        const blueColor = isDarkTheme ? "skyblue" : "blue"
        const orangeColor = "orange"
        return (
            <>
                <span style={{color: blueColor}}>{this.props.replay.gameScore.team0Score}</span>
                {" - "}
                <span style={{color: orangeColor}}>{this.props.replay.gameScore.team1Score}</span>
            </>
        )
    }
}

export const ColouredGameScore = withTheme()(ColouredGameScoreComponent)
