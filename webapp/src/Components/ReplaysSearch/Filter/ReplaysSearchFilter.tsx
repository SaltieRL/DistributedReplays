import {Grid} from "@material-ui/core"
import * as React from "react"
import {ReplaysSearchQueryParams} from "../../../Models/ReplaysSearchQueryParams"
import {RankSelect} from "../../Player/Compare/PlayStyle/RankSelect"
import {PlayerEntry} from "./PlayerEntry"

interface Props {
    queryParams: ReplaysSearchQueryParams
    handleChange: (queryParams: ReplaysSearchQueryParams) => void
}

export class ReplaysSearchFilter extends React.PureComponent<Props> {
    public render() {
        const {queryParams} = this.props
        return (
            <>
                <Grid container spacing={32}>
                    <Grid item xs={12} lg={6}>
                        <PlayerEntry playerIds={queryParams.playerIds || []}
                                     handleChange={this.handlePlayersChange}/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <RankSelect selectedRank={queryParams.rank || -1}
                                    handleChange={this.handleRankChange}
                                    inputLabel="Replay rank"
                                    helperText="Select rank to filter by"
                                    noneLabel="None"
                                    disabled/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <
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
}
