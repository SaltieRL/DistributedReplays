import * as React from "react"
import {MatchHistoryResponse} from "../../Models/Player/MatchHistory"
import {Replay} from "../../Models/Replay/Replay"
import {ReplayDisplayRow} from "./ReplayDisplayRow"

interface Props {
    replaySearchResult: MatchHistoryResponse
}

export class ReplaysSearchResultDisplay extends React.PureComponent<Props> {
    public render() {
        return (
            this.props.replaySearchResult.replays.map((replay: Replay) =>
                <ReplayDisplayRow replay={replay} key={replay.id} useBoxScore={true}/>)
        )
    }
}
