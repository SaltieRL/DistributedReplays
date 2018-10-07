import {Grid, Typography} from "@material-ui/core"
import * as React from "react"
import {PlayStyleResponse} from "../../../../Models/Player/PlayStyle"
import {getPlayerPlayStyles} from "../../../../Requests/Player"
import {PlayerPlayStyleChart} from "../../Overview/PlayStyle/PlayerPlayStyleChart"
import {RankSelect} from "./RankSelect"

interface Props {
    players: Player[]
}

interface State {
    playerPlayStyles: PlayStyleResponse[]
    rank: number
}

export class PlayerComparePlayStyleCharts extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {playerPlayStyles: [], rank: -1}
    }

    public componentDidMount() {
        this.handleAddPlayers(this.props.players)
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.props.players.length > prevProps.players.length) {
            const newPlayers = this.props.players.filter((player) => prevProps.players.indexOf(player) === -1)
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
            this.handleRemovePlayers(indicesToRemove)
        }

        if (this.state.rank !== prevState.rank) {
            this.handleAddPlayers(this.props.players, true)
        }
    }

    public render() {
        const {players} = this.props
        const {playerPlayStyles} = this.state
        if (playerPlayStyles.length === 0) {
            return null
        }

        const compareChartDatas = playerPlayStyles[0].chartDatas
            .map((_, i) => playerPlayStyles
                .map((playStyleResponse) => playStyleResponse.chartDatas[i])
            )
        const chartTitles = playerPlayStyles[0].chartDatas.map((chartData) => chartData.title)

        return (
            <>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <RankSelect selectedRank={this.state.rank || -1}
                                handleChange={this.handleRankChange}
                                inputLabel="Rank to compare"
                                helperText="Select the rank to plot as average"
                                noneLabel="Default"/>
                </Grid>
                {chartTitles.map((chartTitle, i) => {
                    return (
                        <Grid item xs={12} md={5} lg={3} key={chartTitle}
                              style={{height: 400}}>
                            <Typography variant="subheading" align="center">
                                {chartTitle}
                            </Typography>
                            <PlayerPlayStyleChart names={players.map((player) => player.name)}
                                                  data={compareChartDatas[i]}/>
                        </Grid>
                    )
                })}
            </>
        )
    }

    private readonly handleAddPlayers = (players: Player[], reload: boolean = false) => {
        const rank = this.state.rank === -1 ? undefined : this.state.rank
        Promise.all(players.map((player) => getPlayerPlayStyles(player.id, rank)))
            .then((playerPlayStyles) => {
                if (reload) {
                    this.setState({playerPlayStyles})
                } else {
                    this.setState({
                        playerPlayStyles: [...this.state.playerPlayStyles, ...playerPlayStyles]
                    })
                }
            })
    }

    private readonly handleRemovePlayers = (indicesToRemove: number[]) => {
        this.setState({
            playerPlayStyles: this.state.playerPlayStyles
                .filter((_, i) => indicesToRemove.indexOf(i) !== -1)
        })
    }

    private readonly handleRankChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        this.setState({rank: Number(event.target.value)})
    }
}
