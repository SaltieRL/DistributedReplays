import { Divider, Grid } from "@material-ui/core"
import _ from "lodash"
import qs from "qs"
import * as React from "react"
import { RouteComponentProps } from "react-router-dom"
import { getPlayer } from "../../Requests/Player/getPlayer"
import { resolvePlayerNameOrId } from "../../Requests/Player/resolvePlayerNameOrId"
import { AddPlayerInput } from "../Player/Compare/AddPlayerInput"
import { PlayerChip } from "../Player/Compare/PlayerChip"
import { PlayerCompareContent } from "../Player/Compare/PlayerCompareContent"
import { WithNotifications, withNotifications } from "../Shared/Notification/NotificationUtils"
import { BasePage } from "./BasePage"

interface PlayerCompareQueryParams {
    ids: string[]
}

type Props = RouteComponentProps<{}>
    & WithNotifications

interface State {
    ids: string[]
    players: Player[]
    inputId: string
}

class PlayerComparePageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {ids: [], players: [], inputId: ""}
    }

    public componentDidMount() {
        this.readQueryParams()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (prevState.ids !== this.state.ids) {
            // Set params if updated through input
            this.setQueryParams()

            // Get player data on first load
            if (this.state.players.length === 0) {
                this.getPlayers()
            }
        }
    }

    public render() {
        const {players} = this.state
        const playerChips = players.map((player) => (
            <PlayerChip {...player} onDelete={() => this.handleRemovePlayer(player.id)} key={player.id}/>
        ))
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12} container justify="center">
                        <Grid item xs={12} container justify="center">
                            <AddPlayerInput onSubmit={this.attemptToAddPlayer}
                                            value={this.state.inputId}
                                            onChange={this.handleInputChange}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={11} md={10} lg={9} xl={8} container spacing={8}>
                        {playerChips.map((playerChip) => (
                            <Grid item key={playerChip.key as string} style={{maxWidth: "100%"}}>
                                {playerChip}
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item xs={12}> <Divider/> </Grid>
                    <Grid item xs={12}>
                        <PlayerCompareContent players={players}/>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly readQueryParams = () => {
        const queryString = this.props.location.search
        if (queryString !== "") {
            const queryParams: PlayerCompareQueryParams = qs.parse(
                this.props.location.search,
                {ignoreQueryPrefix: true}
            )
            if (queryParams.ids) {
                const ids = Array.isArray(queryParams.ids) ? queryParams.ids : [queryParams.ids]
                this.setState({ids: _.uniq(ids)})
            }
        }
    }

    // TODO: Compartmentalise query params, data retrieval
    private readonly setQueryParams = () => {
        const queryString = qs.stringify(
            {ids: this.state.ids},
            {addQueryPrefix: true, indices: false}
        )
        this.props.history.replace({search: queryString})
    }

    private readonly getPlayers = (): Promise<void> => {
        return Promise.all(this.state.ids.map((id) => getPlayer(id)))
            .then((players) => this.setState({players}))
    }

    private readonly handleRemovePlayer = (id: string) => {
        const index = this.state.ids.indexOf(id)
        try {
            this.setState({
                ids: removeIndexFromArray(this.state.ids, index),
                players: removeIndexFromArray(this.state.players!, index)
            })
        } catch {
            this.props.showNotification({variant: "error", message: "Error removing player", timeout: 2000})
        }
    }

    private readonly handleAddPlayer = (player: Player) => {
        const {ids, players} = this.state
        this.setState({
            ids: [...ids, player.id],
            players: [...players, player]
        })
    }

    private readonly handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({inputId: event.target.value})
    }

    private readonly attemptToAddPlayer = () => {
        const {inputId, ids} = this.state
        if (inputId === "") {
            // TODO: Make input red to gain user's attention?
            return
        }

        if (ids.indexOf(inputId) === -1) {
            resolvePlayerNameOrId(inputId)
                .then(getPlayer)
                .then(this.handleAddPlayer)
                .then(() => this.setState({inputId: ""}))
                .catch(() => {
                    this.props.showNotification({
                        variant: "error",
                        message: "Entered id is not a known player",
                        timeout: 3000
                    })
                })
                .catch((e: any) => {
                    // console.log(e) // TypeError expected here when above .catch catches something.
                    // TODO: Figure out what the right thing to do here is.
                })
        } else {
            this.props.showNotification({
                variant: "info",
                message: "Entered id has already been added",
                timeout: 2000
            })
        }
    }
}

export const PlayerComparePage = withNotifications()(PlayerComparePageComponent)

const removeIndexFromArray = <T extends {}>(array: T[], index: number): T[] => {
    return array.filter((__, i) => i !== index)
}
