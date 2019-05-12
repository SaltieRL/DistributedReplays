import { Card, CardContent, CardHeader, Divider, Grid } from "@material-ui/core"
import * as moment from "moment"
import * as React from "react"
import { ReplaysSearchQueryParams } from "../../../Models"
import { ClearableDatePicker } from "../../Shared/ClearableDatePicker"
import { PlaylistSelect } from "../../Shared/Selects/PlaylistSelect"
import { RankSelect } from "../../Shared/Selects/RankSelect"
import { PlayerEntry } from "./PlayerEntry"

interface Props {
    queryParams: ReplaysSearchQueryParams
    handleChange: (queryParams: ReplaysSearchQueryParams) => void
}

export class ReplaysSearchFilter extends React.PureComponent<Props> {
    public render() {
        const {queryParams} = this.props

        const playerEntry = (
            <PlayerEntry
                playerIds={queryParams.playerIds || []}
                handleChange={this.handlePlayersChange}/>
        )
        const rankSelect = (
            <RankSelect
                selectedRank={queryParams.rank || -1}
                handleChange={this.handleRankChange}
                inputLabel="Replay rank"
                helperText="Select rank to filter by"
                noneLabel="None"
                disabled/>
        )
        const playlistSelect = (
            <PlaylistSelect
                selectedPlaylists={queryParams.playlists || []}
                handleChange={this.handlePlaylistsChange}
                inputLabel="Playlist"
                helperText="Select playlist to filter by"
                multiple/>
        )
        const dateAfterPicker = (
            <ClearableDatePicker
                value={queryParams.dateAfter ? queryParams.dateAfter : null}
                onChange={this.handleDateAfterChange}
                label="Start date"
                helperText="Date after which game must have happened"/>
        )
        const dateBeforePicker = (
            <ClearableDatePicker
                value={queryParams.dateBefore ? queryParams.dateBefore : null}
                onChange={this.handleDateBeforeChange}
                label="End date"
                helperText="Date before which game must have happened"/>
        )
        return (
            <>
                <Grid container spacing={32} justify="center">
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Players" subheader="All selected players will appear in every game."/>
                            <Divider/>
                            <CardContent>
                                {playerEntry}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                {rankSelect}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        {playlistSelect}
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        {dateAfterPicker}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {dateBeforePicker}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </>
        )
    }

    private readonly handlePlayersChange = (players: Player[]) => {
        this.props.handleChange({
            ...this.props.queryParams,
            playerIds: players.map((player) => player.id)
        })
    }

    private readonly handleRankChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedRank = Number(event.target.value)
        if (selectedRank === -1) {
            const {rank, ...remainingQueryParams} = this.props.queryParams
            this.props.handleChange({
                ...remainingQueryParams
            })
        } else {
            this.props.handleChange({
                ...this.props.queryParams,
                rank: Number(event.target.value)
            })
        }
    }

    private readonly handlePlaylistsChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedPlaylists = event.target.value as any as number[]
        if (selectedPlaylists.length === 0) {
            const {playlists, ...remainingQueryParams} = this.props.queryParams
            this.props.handleChange({
                ...remainingQueryParams
            })
        } else {
            this.props.handleChange({
                ...this.props.queryParams,
                playlists: selectedPlaylists
            })
        }
    }

    private readonly handleDateBeforeChange = (date: moment.Moment | null) => {
        if (date === null) {
            const {dateBefore, ...remainingQueryParams} = this.props.queryParams
            this.props.handleChange({
                ...remainingQueryParams
            })
        } else {
            this.props.handleChange({
                ...this.props.queryParams,
                dateBefore: date
            })
        }
    }

    private readonly handleDateAfterChange = (date: moment.Moment | null) => {
        if (date === null) {
            const {dateAfter, ...remainingQueryParams} = this.props.queryParams
            this.props.handleChange({
                ...remainingQueryParams
            })
        } else {
            this.props.handleChange({
                ...this.props.queryParams,
                dateAfter: date
            })
        }
    }
}
