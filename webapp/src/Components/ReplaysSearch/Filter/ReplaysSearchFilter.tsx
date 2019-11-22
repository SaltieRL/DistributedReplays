import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    Theme,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core"
import ExpandMore from "@material-ui/icons/ExpandMore"
import * as moment from "moment"
import * as React from "react"
import {ReplaysSearchQueryParams} from "../../../Models"
import {ClearableDatePicker} from "../../Shared/ClearableDatePicker"
import {PlaylistSelect} from "../../Shared/Selects/PlaylistSelect"
import {RankSelect} from "../../Shared/Selects/RankSelect"
import {PlayerEntry} from "./PlayerEntry"

const styles = (theme: Theme) =>
    createStyles({
        heading: {
            flexBasis: "33.33%",
            flexShrink: 0
        },
        secondaryHeading: {
            color: theme.palette.text.secondary
        }
    })

interface OwnProps {
    queryParams: ReplaysSearchQueryParams
    handleChange: (queryParams: ReplaysSearchQueryParams) => void
}

type Props = OwnProps & WithStyles<typeof styles>

class ReplaysSearchFilterComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, queryParams} = this.props

        const playerEntry = (
            <PlayerEntry playerIds={queryParams.playerIds || []} handleChange={this.handlePlayersChange} />
        )
        const rankSelect = (
            <RankSelect
                selectedRank={queryParams.rank || -1}
                handleChange={this.handleRankChange}
                inputLabel="Replay rank"
                helperText="Select rank to filter by"
                noneLabel="None"
            />
        )
        const playlistSelect = (
            <PlaylistSelect
                selectedPlaylists={queryParams.playlists || []}
                handleChange={this.handlePlaylistsChange}
                inputLabel="Playlist"
                helperText="Select playlist to filter by"
                multiple
            />
        )
        const dateAfterPicker = (
            <ClearableDatePicker
                value={queryParams.dateAfter ? queryParams.dateAfter : null}
                onChange={this.handleDateAfterChange}
                label="Start date"
                helperText="Show replays that happen on or after this date"
                fullWidth
            />
        )
        const dateBeforePicker = (
            <ClearableDatePicker
                value={queryParams.dateBefore ? queryParams.dateBefore : null}
                onChange={this.handleDateBeforeChange}
                label="End date"
                helperText="Show replays that happen on or before this date"
                fullWidth
            />
        )
        return (
            <Card>
                <CardHeader title="Refine your search" />
                <Divider />
                <CardContent>
                    <ExpansionPanel square elevation={0}>
                        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                            <Typography className={classes.heading}>Players</Typography>
                            <Typography className={classes.secondaryHeading}>
                                Players selected will appear in all games
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>{playerEntry}</ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Divider />
                    <ExpansionPanel square elevation={0}>
                        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                            <Typography>Ranks</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>{rankSelect}</ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Divider />
                    <ExpansionPanel square elevation={0}>
                        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                            <Typography>Playlists</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>{playlistSelect}</ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Divider />
                    <ExpansionPanel square elevation={0}>
                        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                            <Typography>Date</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {dateAfterPicker}
                                </Grid>
                                <Grid item xs={12}>
                                    {dateBeforePicker}
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </CardContent>
            </Card>
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
        const selectedPlaylists = (event.target.value as any) as number[]
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

export const ReplaysSearchFilter = withStyles(styles)(ReplaysSearchFilterComponent)
