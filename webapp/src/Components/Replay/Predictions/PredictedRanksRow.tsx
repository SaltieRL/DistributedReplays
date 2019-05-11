import { TableCell, TableRow, Typography } from "@material-ui/core"
import * as React from "react"

interface Props {
    predictedRanks: PredictedRank[]
    playerLeft?: ReplayPlayer
    playerRight?: ReplayPlayer
}

export class PredictedRanksRow extends React.PureComponent<Props> {
    public render() {
        const {predictedRanks, playerLeft, playerRight} = this.props
        const playerLeftRank = playerLeft && predictedRanks.find(
            (predictedRank: PredictedRank) => predictedRank.id === playerLeft.id
        )!.predictedRank
        const playerRightRank = playerRight && predictedRanks.find(
            (predictedRank: PredictedRank) => predictedRank.id === playerRight.id
        )!.predictedRank

        return (
            <TableRow>
                <TableCell align="left">
                    {playerLeft && <Typography>{playerLeft.name}</Typography>}
                </TableCell>
                <TableCell align="center">
                    {playerLeft && <img alt={`Rank image ${predictedRanks[playerLeft.id]}`}
                                        src={`${window.location.origin}/ranks/${playerLeftRank}.png`}
                                        style={{width: 48, height: 48, margin: "auto"}}/>}
                </TableCell>
                <TableCell align="center">
                    {playerRight && <img alt={`Rank image ${predictedRanks[playerRight.id]}`}
                                         src={`${window.location.origin}/ranks/${playerRightRank}.png`}
                                         style={{width: 48, height: 48, margin: "auto"}}/>}
                </TableCell>
                <TableCell align="right">
                    {playerRight && <Typography>{playerRight.name}</Typography>}
                </TableCell>
            </TableRow>
        )
    }
}
