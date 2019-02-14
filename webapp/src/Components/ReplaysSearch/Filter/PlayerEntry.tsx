import { Grid } from "@material-ui/core"
import * as React from "react"
import { getPlayer } from "../../../Requests/Player/getPlayer"
import { resolvePlayerNameOrId } from "../../../Requests/Player/resolvePlayerNameOrId"
import { AddPlayerInput } from "../../Player/Compare/AddPlayerInput"
import { PlayerChip } from "../../Player/Compare/PlayerChip"
import { WithNotifications, withNotifications } from "../../Shared/Notification/NotificationUtils"

interface OwnProps {
    handleChange: (players: Player[]) => void
    playerIds: string[]
}

type Props = OwnProps
    & WithNotifications

interface State {
    players: Player[]
    inputId: string
}

class PlayerEntryComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {players: [], inputId: ""}
    }

    public componentDidMount() {
        Promise.all(this.props.playerIds.map((playerId) => getPlayer(playerId)))
            .then((players) => this.setState({players}))
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.state.players !== prevState.players) {
            this.props.handleChange(this.state.players)
        }
    }

    public render() {
        const playerChips = this.state.players.map((player) => (
            <PlayerChip {...player} onDelete={() => this.handleRemovePlayer(player.id)} key={player.id}/>
        ))
        return (
            <Grid container spacing={32}>
                <Grid item xs={12} container justify="center">
                    <Grid item xs="auto">
                        <AddPlayerInput onSubmit={this.attemptToAddPlayer}
                                        value={this.state.inputId}
                                        onChange={this.handleInputChange}/>
                    </Grid>
                </Grid>
                <Grid item xs={12} container spacing={8}>
                    {playerChips.map((playerChip) => (
                        <Grid item key={playerChip.key as string} zeroMinWidth>
                            {playerChip}
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        )
    }

    private readonly handleRemovePlayer = (id: string) => {
        const index = this.props.playerIds.indexOf(id)
        try {
            this.setState({players: removeIndexFromArray(this.state.players!, index)})
        } catch {
            this.props.showNotification({variant: "error", message: "Error removing player", timeout: 2000})
        }
    }

    private readonly handleAddPlayer = (player: Player) => {
        this.setState({
            players: [...this.state.players, player]
        })
    }

    private readonly handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({inputId: event.target.value})
    }

    private readonly attemptToAddPlayer = () => {
        const {inputId} = this.state
        if (inputId === "") {
            // TODO: Make input red to gain user's attention?
            return
        }

        if (this.props.playerIds.indexOf(inputId) === -1) {
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

const removeIndexFromArray = <T extends {}>(array: T[], index: number): T[] => {
    return array.filter((__, i) => i !== index)
}

export const PlayerEntry = withNotifications()(PlayerEntryComponent)
