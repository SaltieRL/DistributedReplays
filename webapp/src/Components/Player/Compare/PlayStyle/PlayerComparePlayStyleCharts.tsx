import { FormControlLabel, Grid, Switch, Typography } from "@material-ui/core"
import * as React from "react"
import { PlayStyleRawResponse, PlayStyleResponse } from "../../../../Models"
import { getPlayStyle, getPlayStyleRaw } from "../../../../Requests/Player/getPlayStyle"
import { PlaylistSelect } from "../../../Shared/Selects/PlaylistSelect"
import { RankSelect } from "../../../Shared/Selects/RankSelect"
import { PlayerPlayStyleChart } from "../../Overview/PlayStyle/PlayerPlayStyleChart"
import { PlayerCompareTable } from "./PlayerCompareTable"

interface Props {
    players: Player[]
    playlist: number
    handlePlaylistChange?: (playlist: number) => void
}

interface State {
    playerPlayStyles: PlayStyleResponse[]
    playerPlayStylesRaw: PlayStyleRawResponse[]
    rank: number
    heatmapMode: boolean
}

export class PlayerComparePlayStyleCharts extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            playerPlayStyles: [],
            playerPlayStylesRaw: [],
            rank: -1,
            heatmapMode: false
        }
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
        if (this.props.playlist !== prevProps.playlist) {
            this.handleAddPlayers(this.props.players, true)
        }
    }

    public render() {
        const {players} = this.props
        const {playerPlayStyles, playerPlayStylesRaw} = this.state

        const checkbox = (
            <FormControlLabel
                control={<Switch onChange={this.handleHeatmapChange}/>}
                label="Heatmap mode"
            />
        )

        const dropDown = (
            <PlaylistSelect
                selectedPlaylist={this.props.playlist}
                handleChange={this.handlePlaylistsChange}
                inputLabel="Playlist"
                helperText="Select playlist to use"
                dropdownOnly
                currentPlaylistsOnly
                multiple={false}/>
        )

        const rankSelect = (
            <RankSelect selectedRank={this.state.rank || -1}
                        handleChange={this.handleRankChange}
                        inputLabel="Rank to compare"
                        helperText="Select the rank to plot as average"
                        noneLabel="Default"/>
        )

        if (playerPlayStyles.length === 0) {
            return (
              <>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    {rankSelect}
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    {dropDown}
                </Grid>
              </>
            )
        }

        const compareChartDatas = playerPlayStyles[0].chartDatas
            .map((_, i) => playerPlayStyles
                .map((playStyleResponse) => playStyleResponse.chartDatas[i])
            )

        const chartTitles = playerPlayStyles[0].chartDatas.map((chartData) => chartData.title)

        return (
            <>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    {rankSelect}
                </Grid>
                <Grid item xs={12} style={{textAlign: "center"}}>
                    {dropDown}
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
                <Grid container xs={12} justify="center" alignItems="center">
                    <Grid item xs={12} style={{textAlign: "center"}}>
                        {checkbox}
                    </Grid>
                    <Grid item xs="auto">
                        <PlayerCompareTable names={players.map((player) => player.name)}
                                            rawPlayers={playerPlayStylesRaw}
                                            heatmap={this.state.heatmapMode}/>
                    </Grid>
                </Grid>
            </>
        )
    }

    private readonly handleAddPlayers = (players: Player[], reload: boolean = false) => {
        const rank = this.state.rank === -1 ? undefined : this.state.rank
        Promise.all(players.map((player) => getPlayStyle(player.id, rank, this.props.playlist)))
            .then((playerPlayStyles) => {
                if (reload) {
                    this.setState({playerPlayStyles})
                } else {
                    this.setState({
                        playerPlayStyles: [...this.state.playerPlayStyles, ...playerPlayStyles]
                    })
                }
            })
        Promise.all(players.map((player) => getPlayStyleRaw(player.id, this.props.playlist)))
            .then((playerPlayStylesRaw) => {
                if (reload) {
                    this.setState({playerPlayStylesRaw})
                } else {
                    this.setState({
                        playerPlayStylesRaw: [...this.state.playerPlayStylesRaw, ...playerPlayStylesRaw]
                    })
                }
            })
    }

    private readonly handleRemovePlayers = (indicesToRemove: number[]) => {
        this.setState({
            playerPlayStyles: this.state.playerPlayStyles
                .filter((_, i) => indicesToRemove.indexOf(i) === -1),
            playerPlayStylesRaw: this.state.playerPlayStylesRaw
                .filter((_, i) => indicesToRemove.indexOf(i) === -1)
        })
    }

    private readonly handleRankChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        this.setState({rank: Number(event.target.value)})
    }

    private readonly handleHeatmapChange = (event: React.ChangeEvent<HTMLInputElement>,
                                            heatmapMode: boolean) => {
        this.setState({heatmapMode})
    }

    private readonly handlePlaylistsChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedPlaylist = event.target.value as any as number
        if (this.props.handlePlaylistChange) {
            this.props.handlePlaylistChange(selectedPlaylist)
        }
    }
}
