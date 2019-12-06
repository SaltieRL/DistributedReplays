import {Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import * as React from "react"
import {MatchHistoryResponse, Replay, ReplaysSearchQueryParams} from "../../Models"
import {addGames, searchReplays} from "../../Requests/Replay"
import {ReplaysSearchWithQueryString} from "../ReplaysSearch/Filter/ReplaysSearchWithQueryString"
import {ReplaysSearchResultDisplay} from "../ReplaysSearch/ReplaysSearchResultDisplay"
import {WithNotifications, withNotifications} from "../Shared/Notification/NotificationUtils"

interface OwnProps {
    openDialog: boolean
    onCloseDialog: () => void
    group: string
}

type Props = OwnProps & WithNotifications

interface State {
    replaySearchResult?: MatchHistoryResponse
    queryParams?: ReplaysSearchQueryParams
    page: number
    limit: number
}

class GroupDialogComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {page: 0, limit: 10}
    }

    public componentDidUpdate(prevProps: unknown, prevState: Readonly<State>) {
        if (this.state.queryParams !== prevState.queryParams) {
            this.updateReplays()
        }
    }

    public render() {
        return (
            <Dialog
                open={this.props.openDialog}
                onClose={this.props.onCloseDialog}
                scroll="paper"
                PaperProps={{style: {minWidth: 600, maxWidth: "90vw"}}}
            >
                <DialogTitle id="form-dialog-title">Add replays to group</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1} justify="center">
                        <Grid item xs={12} container spacing={1} alignContent="flex-start">
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Filters
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ReplaysSearchWithQueryString handleChange={this.handleQueryParamsChange} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignContent="flex-start">
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Replays
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {this.state.replaySearchResult && this.state && (
                                    <ReplaysSearchResultDisplay
                                        replaySearchResult={this.state.replaySearchResult}
                                        handleUpdateTags={(replay: Replay) => (tags: Tag[]) => null}
                                        buttonText={"Add replays"}
                                        selectedAction={this.selectReplays}
                                        page={this.state.page}
                                        limit={this.state.limit}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onCloseDialog} variant={"outlined"}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    private readonly handleQueryParamsChange = (queryParams: ReplaysSearchQueryParams) => {
        this.setState({queryParams})
    }

    private readonly updateReplays = () => {
        if (this.state.queryParams !== undefined) {
            searchReplays(this.state.queryParams).then((replaySearchResult) => {
                this.setState({replaySearchResult})
            })
            // TODO: handle error
        } else {
            this.setState({
                replaySearchResult: undefined
            })
        }
    }

    private readonly selectReplays = (ids: string[]) => {
        addGames(this.props.group, ids)
        this.props.onCloseDialog()
    }
}

export const GroupAddDialog = withNotifications()(GroupDialogComponent)
