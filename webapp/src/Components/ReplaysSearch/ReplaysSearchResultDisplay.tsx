import {Paper, Table, TableRow, Typography} from "@material-ui/core"
import * as React from "react"
import {MatchHistoryResponse} from "../../Models/Player/MatchHistory"
import {Replay} from "../../Models/Replay/Replay"
import {ReplayDisplayRow} from "./ReplayDisplayRow"
import {ReplaysSearchTablePagination} from "./ReplaysSearchTablePagination"

interface Props {
    replaySearchResult: MatchHistoryResponse
    page: number
    limit: number
    selectable?: boolean
    onChecked?: (id: string, checked: boolean) => void
}

export class ReplaysSearchResultDisplay extends React.PureComponent<Props> {
    public render() {
        const {replaySearchResult, page, limit} = this.props
        return (
            <>
                {replaySearchResult.replays.length > 0 ?
                    <>
                        {!this.props.selectable && this.props.replaySearchResult.replays.map((replay: Replay) =>
                            <ReplayDisplayRow replay={replay} key={replay.id} useBoxScore={true}/>
                        )}
                        {this.props.selectable &&
                        <>
                            <Paper>
                                <Table>
                                    {this.props.replaySearchResult.replays.map((replay: Replay) =>
                                        <TableRow key={"hover"}>
                                            <ReplayDisplayRow replay={replay} key={replay.id} useBoxScore={true}
                                                              selectable onChecked={this.onChecked}/>
                                        </TableRow>
                                    )}
                                </Table>
                            </Paper>
                        </>
                        }
                        <ReplaysSearchTablePagination
                            totalCount={replaySearchResult.totalCount}
                            page={page}
                            limit={limit}/>
                    </>
                    :
                    <Typography variant="subheading" align="center">
                        <i>No replays match the selected filters.</i>
                    </Typography>
                }
            </>
        )
    }

    private readonly onChecked = (id: string, checked: boolean) => {
        if (this.props.onChecked) {
            this.props.onChecked(id, checked)
        }
    }
}
