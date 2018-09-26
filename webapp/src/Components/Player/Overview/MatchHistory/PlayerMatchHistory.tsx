import {Grid, TablePagination} from "@material-ui/core"
import * as qs from "qs"
import * as React from "react"
import {RouteComponentProps, withRouter} from "react-router"
import {MatchHistoryResponse} from "../../../../Models/Player/MatchHistory"
import {Replay} from "../../../../Models/Replay/Replay"
import {getMatchHistory} from "../../../../Requests/Player"
import {LoadableWrapper} from "../../../Shared/LoadableWrapper"
import {MatchHistoryRow} from "./MatchHistoryRow"

interface MatchHistoryQueryParams {
    page: string
    limit: string
}

interface OwnProps {
    player: Player
    useBoxScore: boolean
    useHeader?: boolean
}

type Props = OwnProps
    & RouteComponentProps<{}>

interface State {
    matchHistory?: MatchHistoryResponse
    reloadSignal: boolean
    page: number
    limit: number
}

export class PlayerMatchHistoryComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            reloadSignal: false,
            page: 0,
            limit: 10
        }
    }

    public componentDidMount() {
        this.readQueryParams()
        this.setQueryParams()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (prevProps.player.id !== this.props.player.id) {
            this.triggerReload()
            return
        }
        if ((prevState.page !== this.state.page) || (prevState.limit !== this.state.limit)) {
            this.triggerReload()
            this.setQueryParams()
            return
        }
        if (prevProps.location.search !== this.props.location.search) {
            this.readQueryParams()
        }
    }

    public render() {
        return (
            <Grid container>
                {this.props.useHeader &&
                <Grid item xs={12}>
                    <MatchHistoryRow header/>
                </Grid>
                }
                <Grid item xs={12}>
                    <LoadableWrapper load={this.getPlayerMatchHistory} reloadSignal={this.state.reloadSignal}>
                        {this.state.matchHistory &&
                        this.state.matchHistory.replays.map((replay: Replay) =>
                            <MatchHistoryRow replay={replay} player={this.props.player} key={replay.name}
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

    private readonly readQueryParams = () => {
        const queryString = this.props.location.search
        if (queryString !== "") {
            const queryParams: MatchHistoryQueryParams = qs.parse(
                this.props.location.search,
                {ignoreQueryPrefix: true}
            )
            const page = Number(queryParams.page) - 1
            const limit = Number(queryParams.limit)

            if (!isNaN(page) && !isNaN(limit)) {
                this.setState({page, limit})
            }
        }
    }

    private readonly setQueryParams = () => {
        const queryString = qs.stringify(
            {page: this.state.page + 1, limit: this.state.limit},
            {addQueryPrefix: true}
        )
        this.props.history.replace({search: queryString})

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

export const PlayerMatchHistory = withRouter(PlayerMatchHistoryComponent)
