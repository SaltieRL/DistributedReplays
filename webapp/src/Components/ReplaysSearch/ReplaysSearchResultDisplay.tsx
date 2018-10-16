import { Typography } from "@material-ui/core"
import * as React from "react"
import { MatchHistoryResponse, Replay } from "src/Models"
import { ReplayDisplayRow } from "./ReplayDisplayRow"
import { ReplaysSearchTablePagination } from "./ReplaysSearchTablePagination"

interface Props {
    replaySearchResult: MatchHistoryResponse
    page: number
    limit: number
}

export class ReplaysSearchResultDisplay extends React.PureComponent<Props> {
    public render() {
        const { replaySearchResult, page, limit } = this.props
        return (
            <>
                {replaySearchResult.replays.length > 0 ? (
                    <>
                        {this.props.replaySearchResult.replays.map((replay: Replay) => (
                            <ReplayDisplayRow replay={replay} key={replay.id} useBoxScore={true} />
                        ))}
                        <ReplaysSearchTablePagination
                            totalCount={replaySearchResult.totalCount}
                            page={page}
                            limit={limit}
                        />
                    </>
                ) : (
                    <Typography variant="subheading" align="center">
                        <i>No replays match the selected filters.</i>
                    </Typography>
                )}
            </>
        )
    }
}
