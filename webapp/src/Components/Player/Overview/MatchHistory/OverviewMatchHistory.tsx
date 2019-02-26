import { Grid, TablePagination } from "@material-ui/core"
import * as React from "react"
import { MatchHistoryResponse, Replay } from "../../../../Models"
import { getMatchHistory } from "../../../../Requests/Player/getMatchHistory"
import { LoadableWrapper } from "../../../Shared/LoadableWrapper"
import { OverviewMatchHistoryRow } from "./OverviewMatchHistoryRow"

interface Props {
    player: Player
    useBoxScore: boolean
}

interface State {
    matchHistory?: MatchHistoryResponse
    reloadSignal: boolean
    page: number
    limit: number
}

export class OverviewMatchHistory extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            reloadSignal: false,
            page: 0,
            limit: 10
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (prevProps.player.id !== this.props.player.id) {
            this.triggerReload()
            return
        }
        if ((prevState.page !== this.state.page) || (prevState.limit !== this.state.limit)) {
            this.triggerReload()
            return
        }
    }

    public render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <LoadableWrapper load={this.getPlayerMatchHistory} reloadSignal={this.state.reloadSignal}>
                        {this.state.matchHistory &&
                        this.state.matchHistory.replays.map((replay: Replay) =>
                            <OverviewMatchHistoryRow
                                key={replay.id}
                                replay={replay}
                                player={this.props.player}
                                useBoxScore={this.props.useBoxScore}/>)
                        }
                    </LoadableWrapper>
                </Grid>
                <Grid item xs={12}>
                    <TablePagination
                        component="div"
                        count={this.state.matchHistory ? this.state.matchHistory.totalCount : 0}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        page={this.state.page}
                        rowsPerPage={this.state.limit}
                        rowsPerPageOptions={[10, 25, 50]}
                    />
                </Grid>
            </Grid>
        )
    }

    private readonly getPlayerMatchHistory = (): Promise<void> => {
        return getMatchHistory(this.props.player.id, this.state.page, this.state.limit)
            .then((matchHistory) => this.setState({matchHistory}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }

    private readonly handleChangePage = (event: any, page: number) => {
        this.setState({page})
    }

    private readonly handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> =
        (event) => {
            this.setState({page: 0, limit: Number(event.target.value)})
        }
}
