import {Card, CardHeader, Checkbox, Divider, FormControlLabel, List, Typography} from "@material-ui/core"
import Send from "@material-ui/icons/Send"
import * as _ from "lodash"
import * as qs from "qs"
import * as React from "react"
import {REPLAYS_GROUP_PAGE_LINK} from "../../Globals"
import {MatchHistoryResponse} from "../../Models/Player/MatchHistory"
import {Replay} from "../../Models/Replay/Replay"
import {LinkButton} from "../Shared/LinkButton"
import {ReplayDisplayRow} from "./ReplayDisplayRow"
import {ReplaysSearchTablePagination} from "./ReplaysSearchTablePagination"

interface Props {
    replaySearchResult: MatchHistoryResponse
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

        const linkDisabled = this.state.selectedReplayIds.length === 0

        return (
            <>
                {replaySearchResult.replays.length > 0 ?
                    <Card>
                        <CardHeader title="Results" action={
                            <div style={{paddingRight: 8}}>
                                <FormControlLabel
                                    control={<Checkbox checked={this.state.selectable}
                                                       onChange={this.handleSelectableChange}/>}
                                    label="Select mode"
                                />
                                <LinkButton icon={Send} iconType="mui"
                                            to={this.getGroupLink()}
                                            disabled={linkDisabled}
                                            tooltip="Select at least one replay to view as group">
                                    View as group
                                </LinkButton>
                            </div>
                        }/>
                        {selectable ?
                            <List>
                                <Divider/>
                                {this.props.replaySearchResult.replays.map((replay: Replay, i) =>
                                    <>
                                        <ReplayDisplayRow replay={replay} key={replay.id} useBoxScore={true}
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
                                <ReplayDisplayRow replay={replay} key={replay.id} useBoxScore={true}/>
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
