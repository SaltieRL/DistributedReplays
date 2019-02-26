import { Card, CardHeader, Divider, List, Typography } from "@material-ui/core"
import * as _ from "lodash"
import * as qs from "qs"
import * as React from "react"
import { REPLAYS_GROUP_PAGE_LINK } from "../../Globals"
import { MatchHistoryResponse, Replay } from "../../Models"
import { ReplayDisplayRow } from "./ReplayDisplayRow"
import { ReplaysSearchTablePagination } from "./ReplaysSearchTablePagination"
import { ResultsActions } from "./ResultsActions"

interface Props {
    replaySearchResult: MatchHistoryResponse
    handleUpdateTags: (replay: Replay) => (tags: Tag[]) => void
    page: number
    limit: number
}

interface State {
    selectable: boolean
    selectedReplayIds: string[]
}

export class ReplaysSearchResultDisplay extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectable: false, selectedReplayIds: []}
    }

    public render() {
        const {replaySearchResult, page, limit} = this.props
        const {selectable} = this.state

        return (
            <>
                {replaySearchResult.replays.length > 0 ?
                    <Card>
                        <CardHeader title="Results" action={
                            <ResultsActions disabled={this.state.selectedReplayIds.length === 0}
                                            to={this.getGroupLink()}
                                            handleSelectableChange={this.handleSelectableChange}
                                            selectable={this.state.selectable}/>}/>
                        {selectable ?
                            <List dense>
                                <Divider/>
                                {this.props.replaySearchResult.replays.map((replay: Replay, i) =>
                                    <>
                                        <ReplayDisplayRow
                                            key={replay.id}
                                            replay={replay}
                                            handleUpdateTags={this.props.handleUpdateTags(replay)}
                                            useBoxScore
                                            selectProps={{
                                                selected: _.includes(
                                                    this.state.selectedReplayIds,
                                                    replay.id
                                                ),
                                                handleSelectChange: this.handleSelectChange(replay.id)
                                            }}/>
                                        {!(i === this.props.replaySearchResult.replays.length) && <Divider/>}
                                    </>
                                )}
                            </List>
                            :
                            this.props.replaySearchResult.replays.map((replay: Replay) =>
                                <ReplayDisplayRow
                                    key={replay.id}
                                    replay={replay}
                                    handleUpdateTags={this.props.handleUpdateTags(replay)}
                                    useBoxScore
                                />
                            )
                        }
                        <ReplaysSearchTablePagination
                            totalCount={replaySearchResult.totalCount}
                            page={page}
                            limit={limit}/>
                    </Card>
                    :
                    <Typography variant="subheading" align="center">
                        <i>No replays match the selected filters.</i>
                    </Typography>
                }
            </>
        )
    }

    private readonly handleSelectableChange = (event: React.ChangeEvent<HTMLInputElement>,
                                               selectable: boolean) => {
        this.setState({selectable})
        if (!selectable) {
            this.setState({
                selectedReplayIds: []
            })
        }
    }

    private readonly handleSelectChange = (id: string) => (checked: boolean) => {
        if (!checked) {
            this.setState({
                selectedReplayIds: this.state.selectedReplayIds.filter((replayId) => replayId !== id)
            })
        } else {
            this.setState({
                selectedReplayIds: [...this.state.selectedReplayIds, id]
            })
        }
    }

    private readonly getGroupLink = () => {
        const url = qs.stringify({ids: this.state.selectedReplayIds},
            {arrayFormat: "repeat", addQueryPrefix: true})
        return REPLAYS_GROUP_PAGE_LINK + url
    }
}
