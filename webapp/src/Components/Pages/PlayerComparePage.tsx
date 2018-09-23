import {Avatar, Chip, Grid, TextField} from "@material-ui/core"
import * as qs from "qs"
import * as React from "react"
import {RouteComponentProps} from "react-router-dom"
import {PlayStyleResponse} from "../../Models/Player/PlayStyle"
import {getPlayer, getPlayerPlayStyles} from "../../Requests/Player"
import {PlayerCompareView} from "../Player/PlayerCompareView"
import {LoadableWrapper} from "../Shared/LoadableWrapper"
import {BasePage} from "./BasePage"

interface PlayerCompareQueryParams {
    ids: string[]
}

type Props = RouteComponentProps<{}>

interface State {
    ids: string[]
    players: Player[]
    playerPlayStyles: PlayStyleResponse[]
    inputId: string
}

export class PlayerComparePage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {ids: [], players: [], playerPlayStyles: [], inputId: ""}
    }

    public componentDidMount() {
        this.readQueryParams()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (prevState.ids !== this.state.ids) {
            this.setQueryParams()
        }
    }

    public render() {
        const {ids, players, playerPlayStyles} = this.state
        const playerChips = players.map((player) => (
            <PlayerChip {...player} onDelete={() => this.handleRemovePlayer(player.id)} key={player.id}/>
        ))
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12}>
                        <form onSubmit={this.handleFormSubmit}>
                            <TextField value={this.state.inputId} onChange={this.handleInputChange}/>
                        </form>
                    </Grid>
                    <Grid item xs={12}>
                        {playerChips}
                    </Grid>
                    <LoadableWrapper load={this.getPlayersData}>
                        <PlayerCompareView ids={ids}
                                           players={players}
                                           playerPlayStyles={playerPlayStyles}/>
                    </LoadableWrapper>
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
                this.setState({ids: queryParams.ids})
            }
        }
    }

    private readonly setQueryParams = () => {
        const queryString = qs.stringify(
            {ids: this.state.ids},
            {addQueryPrefix: true, indices: false, arrayFormat: "brackets"}
        )
        this.props.history.replace({search: queryString})
    }

    private readonly getPlayersData = (): Promise<unknown> => {
        return Promise.all([this.getPlayers(), this.getPlayerPlayStyles()])
    }

    private readonly getPlayers = (): Promise<void> => {
        return Promise.all(this.state.ids.map((id) => getPlayer(id)))
            .then((players) => this.setState({players}))
    }

    private readonly getPlayerPlayStyles = (): Promise<void> => {
        return Promise.all(this.state.ids.map((id) => getPlayerPlayStyles(id)))
            .then((playerPlayStyles) => this.setState({playerPlayStyles}))
    }

    private readonly handleRemovePlayer = (id: string) => {
        const index = this.state.ids.indexOf(id)
        try {
            this.setState({
                ids: removeIndexFromArray(this.state.ids, index),
                players: removeIndexFromArray(this.state.players!, index),
                playerPlayStyles: removeIndexFromArray(this.state.playerPlayStyles!, index)
            })
        } catch {
            console.log("Error removing player")
            // TODO: Handle errors w/ notification
        }
    }

    private readonly handleAddPlayer = (player: Player) => {
        const {ids, players, playerPlayStyles} = this.state
        getPlayerPlayStyles(player.id)
            .then((playerPlayStyle) => {
                this.setState({
                    ids: [...ids, player.id],
                    players: [...players, player],
                    playerPlayStyles: [...playerPlayStyles, playerPlayStyle]
                })
            })
            .catch(() => {
                console.log("Error removing player")
                // TODO: handle catch and display notification
            })
    }

    private readonly handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({inputId: event.target.value})
    }

    private readonly handleFormSubmit: React.ChangeEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        this.attemptToAddPlayer()
    }

    private readonly attemptToAddPlayer = () => {
        const id = this.state.inputId
        getPlayer(id)
            .catch(() => {
                console.log("Entered id is not a known player")
                // TODO: handle catch and display notification
            })
            .then(this.handleAddPlayer)
    }
}

const removeIndexFromArray = <T extends {}>(array: T[], index: number): T[] => {
    return array.filter((_, i) => i !== index)
}

interface PlayerChipProps extends Player {
    onDelete: () => void
}

const PlayerChip: React.SFC<PlayerChipProps> = (props) => (
    <Chip
        avatar={<Avatar src={props.avatarLink}/>}
        label={props.name}
        onDelete={props.onDelete}/>
)
