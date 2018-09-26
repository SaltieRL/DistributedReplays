import {Grid, Typography} from "@material-ui/core"
import * as _ from "lodash"
import * as React from "react"
import {PlayStyleProgressionPoint} from "../../../../Models/Player/PlayStyle"
import {getPlayerProgression} from "../../../../Requests/Player"
import {convertSnakeAndCamelCaseToReadable} from "../../../../Utils/String"
import {FieldSelect} from "./FieldSelect"
import {ProgressionChart} from "./ProgressionChart"

interface Props {
    players: Player[]
}

interface State {
    playStyleProgressions: PlayStyleProgressionPoint[][]
    fields: string[]
    selectedFields: string[]
}

export class PlayerProgressionCharts extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            playStyleProgressions: [],
            fields: [],
            selectedFields: []
        }
    }

    public componentDidMount() {
        this.handleAddPlayers(this.props.players)
        this.updateFields()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.props.players.length > prevProps.players.length) {
            const newPlayers = this.props.players.filter((player) => prevProps.players.indexOf(player) === -1)
            console.log("adding new players: " + JSON.stringify(newPlayers))
            this.handleAddPlayers(newPlayers)
        }
        if (this.props.players.length < prevProps.players.length) {
            const indicesToRemove: number[] = []
            prevProps.players
                .forEach((player, i) => {
                    if (this.props.players.indexOf(player) === -1) {
                        indicesToRemove.push(i)
                    }
                })
            console.log("removing index " + JSON.stringify(indicesToRemove))
            this.handleRemovePlayers(indicesToRemove)
        }

        if (this.state.playStyleProgressions.length !== prevState.playStyleProgressions.length) {
            this.updateFields()
        }
    }

    public render() {
        const {players} = this.props
        const {playStyleProgressions} = this.state
        if (playStyleProgressions.length === 0) {
            return null
        }

        const playerPlayStyleProgressions = playStyleProgressions.map((playStyleProgressionPoints, i) => ({
            player: players[i],
            playStyleProgressionPoints
        }))

        return (
            <>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <FieldSelect fields={this.state.fields}
                                 selectedFields={this.state.selectedFields}
                                 handleChange={this.handleSelectChange}
                    />
                </Grid>
                {this.state.selectedFields.map((field) => {
                    return (
                        <Grid item xs={12} md={6} lg={5} key={field}
                              style={{height: 400}}>
                            <Typography variant="subheading" align="center">
                                {convertSnakeAndCamelCaseToReadable(field)}
                            </Typography>
                            <ProgressionChart field={field} playerPlayStyleProgressions={playerPlayStyleProgressions}/>
                        </Grid>
                    )
                })}
            </>
        )
    }

    private readonly updateFields = () => {
        const fields = _.uniq(
            _.flatMap(this.state.playStyleProgressions,
                ((playStyleProgression) =>
                        _.flatMap(playStyleProgression,
                            ((playStyleProgressionPoint) =>
                                playStyleProgressionPoint.dataPoints
                                    .map((dataPoint) => dataPoint.name))
                        )
                )
            )
        )
        this.setState({fields})
    }

    private readonly handleAddPlayers = (players: Player[]) => {
        Promise.all(players.map((player) => getPlayerProgression(player.id)))
            .then((playersProgressions) => {
                this.setState({
                    playStyleProgressions: [...this.state.playStyleProgressions, ...playersProgressions]
                })
            })
    }

    private readonly handleRemovePlayers = (indicesToRemove: number[]) => {
        this.setState({
            playStyleProgressions: this.state.playStyleProgressions
                .filter((__, i) => indicesToRemove.indexOf(i) !== -1)
        })
    }

    private readonly handleSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        this.setState({
            selectedFields: event.target.value as any as string[]
        })
    }
}
