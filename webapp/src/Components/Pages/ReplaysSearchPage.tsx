import {Card, CardContent, Checkbox, FormControlLabel, Grid, IconButton, Typography} from "@material-ui/core"
import {Send} from "@material-ui/icons"
import * as qs from "qs"
import * as React from "react"
import {RouteComponentProps, withRouter} from "react-router"
import {REPLAYS_GROUP_PAGE_LINK} from "../../Globals"
import {MatchHistoryResponse} from "../../Models/Player/MatchHistory"
import {ReplaysSearchQueryParams} from "../../Models/ReplaysSearchQueryParams"
import {searchReplays} from "../../Requests/Replay"
import {ReplaysSearchWithQueryString} from "../ReplaysSearch/Filter/ReplaysSearchWithQueryString"
import {ReplaysSearchResultDisplay} from "../ReplaysSearch/ReplaysSearchResultDisplay"
import {BasePage} from "./BasePage"

interface State {
    queryParams?: ReplaysSearchQueryParams
    replaySearchResult?: MatchHistoryResponse
    selectMode: boolean
    selectedReplays: string[]
}

class ReplaysSearchPageComponent extends React.PureComponent<RouteComponentProps<{}>, State> {
    constructor(props: RouteComponentProps<{}>) {
        super(props)
        this.state = {selectMode: false, selectedReplays: []}
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
                    <Grid item xs={12} md={4} container spacing={32}>
                        <Grid item xs={12}>
                            <Typography variant="title" align="center" gutterBottom>
                                Filters
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <ReplaysSearchWithQueryString handleChange={this.handleQueryParamsChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <FormControlLabel
                                        control={
                                            <Checkbox onChange={this.toggleSelectable}>
                                                Select Mode
                                            </Checkbox>} label="Select Mode"/>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={8} container alignContent="flex-start">
                        <Grid item xs={12}>
                            <Typography variant="title" align="center" gutterBottom>
                                Replays
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {this.state.replaySearchResult && this.state.queryParams &&
                            <ReplaysSearchResultDisplay replaySearchResult={this.state.replaySearchResult}
                                                        page={this.state.queryParams.page}
                                                        limit={this.state.queryParams.limit}
                                                        selectable={this.state.selectMode}
                                                        onChecked={this.onChecked}/>
                            }
                        </Grid>
                        {this.state.selectMode &&
                        <Grid item xs={12} container alignContent="flex-end">
                            <FormControlLabel
                                control={<IconButton onClick={this.handleGroup}>
                                    <Send/>
                                </IconButton>}
                                label="Group"/>
                        </Grid>
                        }
                    </Grid>
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
            this.setState({
                replaySearchResult: {
                    totalCount: 1,
                    replays: []
                },
                selectedReplays: []
            })
        }
    }

    private readonly toggleSelectable = (event: object, checked: boolean) => {
        this.setState({selectMode: checked})
    }

    private readonly onChecked = (id: string, checked: boolean) => {
        if (!checked) {
            this.setState({
                selectedReplays: this.state.selectedReplays.filter((x) => x !== id)
            })
        } else {
            this.setState({
                selectedReplays: this.state.selectedReplays.concat([id])
            })
        }
    }

    private readonly handleGroup = () => {
        const url = qs.stringify({ids: this.state.selectedReplays},
            {arrayFormat: "repeat", addQueryPrefix: true})
        this.props.history.push(REPLAYS_GROUP_PAGE_LINK + url)
    }
}

export const ReplaysSearchPage = withRouter(ReplaysSearchPageComponent)
