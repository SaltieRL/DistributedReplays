import { Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { MatchHistoryResponse, Replay } from "../../Models"
import { ReplaysSearchResultDisplay } from "../ReplaysSearch/ReplaysSearchResultDisplay"
import { BasePage } from "./BasePage"
import { getTaggedMatches } from "../../Requests/Player/getTaggedReplays"

interface State {
    replaySearchResult?: MatchHistoryResponse
}

interface RouteParams {
    id: string
    tagname: string
}

type Props = RouteComponentProps<RouteParams>


export class TaggedMatchesPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
        this.updateReplays()
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12} md={8} container alignContent="flex-start">
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center" gutterBottom>
                                Replays for tag: {this.props.match.params.tagname}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {this.state.replaySearchResult &&
                            <ReplaysSearchResultDisplay
                                replaySearchResult={this.state.replaySearchResult}
                                handleUpdateTags={this.handleUpdateTags}
                                page={1}
                                limit={50}/>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    // private readonly handleQueryParamsChange = (queryParams: ReplaysSearchQueryParams) => {
    //     this.setState({queryParams})
    // }

    private readonly updateReplays = () => {

        getTaggedMatches(this.props.match.params.id, this.props.match.params.tagname)
            .then((replaySearchResult) => {
                this.setState({replaySearchResult})
            })
    }

    private readonly handleUpdateTags = (replay: Replay) => (tags: Tag[]) => {
        if (this.state.replaySearchResult) {
            this.setState({
                replaySearchResult: {
                    ...this.state.replaySearchResult,
                    replays: [
                        ...this.state.replaySearchResult.replays
                            .map((searchResultReplay): Replay => {
                                if (searchResultReplay.id === replay.id) {
                                    return {
                                        ...searchResultReplay,
                                        tags
                                    }
                                }
                                return searchResultReplay
                            })
                    ]
                }
            })
        }
    }
}
