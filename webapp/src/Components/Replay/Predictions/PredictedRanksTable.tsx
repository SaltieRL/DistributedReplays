import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { PredictedRanksRow } from "./PredictedRanksRow"

interface Props {
    replay: Replay
    predictedRanks: PredictedRank[]
}

export class PredictedRanksTable extends React.PureComponent<Props> {
    public render() {
        const {replay, predictedRanks} = this.props
        const blueTeam =
            replay.players.filter((player) => !player.isOrange)
        const orangeTeam =
            replay.players.filter((player) => player.isOrange)
        const maxLength = Math.max(blueTeam.length, orangeTeam.length)
        const rows = []
        for (let i = 0; i < maxLength; i++) {
            const playerLeft = i < blueTeam.length ? blueTeam[i] : undefined
            const playerRight = i < orangeTeam.length ? orangeTeam[i] : undefined
            rows.push((
                <PredictedRanksRow predictedRanks={predictedRanks}
                                   playerLeft={playerLeft} playerRight={playerRight}/>)
            )
        }

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">
                            Player (Blue)
                        </TableCell>
                        <TableCell colSpan={2} align="center">
                            Predicted Play Level
                        </TableCell>
                        <TableCell align="right">
                            Player (Orange)
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        )
    }
}
