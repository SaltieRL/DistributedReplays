import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { MatchHistoryResponse, ReplaysSearchQueryParams } from "src/Models"
import { ReplayService } from "src/Requests"
import { ReplaysSearchWithQueryString } from "../ReplaysSearch/Filter/ReplaysSearchWithQueryString"
import { ReplaysSearchResultDisplay } from "../ReplaysSearch/ReplaysSearchResultDisplay"
import { BasePage } from "./BasePage"

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
                    <Grid item xs={12} md={4} container>
                        <Grid item xs={12}>
                            <Typography variant="title" align="center" gutterBottom>
                                Filters
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <ReplaysSearchWithQueryString handleChange={this.handleQueryParamsChange} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={8} container alignContent="flex-start">
                        <Grid item xs={12}>
                            <Typography variant="title" align="center" gutterBottom>
                                Replays
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {this.state.replaySearchResult &&
                                this.state.queryParams && (
                                    <ReplaysSearchResultDisplay
                                        replaySearchResult={this.state.replaySearchResult}
                                        page={this.state.queryParams.page}
                                        limit={this.state.queryParams.limit}
                                    />
                                )}
                        </Grid>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly handleQueryParamsChange = (queryParams: ReplaysSearchQueryParams) => {
        this.setState({ queryParams })
    }

    private readonly updateReplays = () => {
        if (this.state.queryParams !== undefined) {
            ReplayService.getInstance()
                .searchReplays(this.state.queryParams)
                .then((replaySearchResult) => {
                    this.setState({ replaySearchResult })
                })
            // TODO: handle error
        } else {
            this.setState({ replaySearchResult: undefined })
        }
    }
}
