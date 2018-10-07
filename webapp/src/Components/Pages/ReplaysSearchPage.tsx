import {Divider, Grid} from "@material-ui/core"
import * as React from "react"
import {MatchHistoryResponse} from "../../Models/Player/MatchHistory"
import {ReplaysSearchQueryParams} from "../../Models/ReplaysSearchQueryParams"
import {searchReplays} from "../../Requests/Replay"
import {ReplaysSearchWithQueryString} from "../ReplaysSearch/Filter/ReplaysSearchWithQueryString"
import {ReplaysSearchResultDisplay} from "../ReplaysSearch/ReplaysSearchResultDisplay"
import {BasePage} from "./BasePage"

interface State {
    queryParams?: ReplaysSearchQueryParams
    replaySearchResult?: MatchHistoryResponse
}

export class ReplaysSearchPage extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }

    public componentDidUpdate(prevProps: unknown, prevState: Readonly<State>) {
        if (this.state.queryParams !== prevState.queryParams) {
            this.updateReplays()
        }
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12}>
                        <ReplaysSearchWithQueryString handleChange={this.handleQueryParamsChange}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>
                    {this.state.replaySearchResult && this.state.queryParams &&
                    <Grid item xs={12}>
                        <ReplaysSearchResultDisplay replaySearchResult={this.state.replaySearchResult}
                                                    page={this.state.queryParams.page}
                                                    limit={this.state.queryParams.limit}/>
                    </Grid>
                    }
                </Grid>
            </BasePage>
        )
    }

    private readonly handleQueryParamsChange = (queryParams: ReplaysSearchQueryParams) => {
        this.setState({queryParams})
    }

    private readonly updateReplays = () => {
        if (this.state.queryParams !== undefined) {
            searchReplays(this.state.queryParams)
                .then((replaySearchResult) => {
                    this.setState({replaySearchResult})
                })
            // TODO: handle error
        } else {
            this.setState({replaySearchResult: undefined})
        }
    }
}
