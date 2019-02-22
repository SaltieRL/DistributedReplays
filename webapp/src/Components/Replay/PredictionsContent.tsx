import { CardContent, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { PlayerStatsSubcategory, Replay } from "../../Models"

interface Props {
    replay: Replay
    predictedRanks: any
}

interface State {
    selectedTab: PlayerStatsSubcategory
}

export class PredictionsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: PlayerStatsSubcategory.HITS}
    }

    public render() {
        const {replay, predictedRanks} = this.props
        const ranksEmpty = Object.keys(predictedRanks).length === 0 && predictedRanks.constructor === Object
        const blueTeam =
            replay.players.filter((player) => !player.isOrange)
        const orangeTeam =
            replay.players.filter((player) => player.isOrange)
        const maxLength = Math.max(blueTeam.length, orangeTeam.length)
        const rows = []
        for (let i = 0; i < maxLength; i++) {
            if (i < blueTeam.length) {
                if (i < orangeTeam.length) {
                    rows.push(this.createRow(blueTeam[i], orangeTeam[i]))
                } else {
                    rows.push(this.createRow(blueTeam[i], null))
                }
            } else {
                if (i < orangeTeam.length) {
                    rows.push(this.createRow(null, orangeTeam[i]))
                }
            }
        }
        return (
            <>
            <Divider/>
            <CardContent>
                <Grid container spacing={32} justify="center">
                    <Grid item xs={4}>
                        {!ranksEmpty ? this.createTable(rows)
                            :
                            <Typography>No predictions for this gamemode are available.</Typography>}
                    </Grid>
                </Grid>
            </CardContent>
            </>
        )
    }

    private createRow(player: any, playerRight: any) {
        const {predictedRanks} = this.props
        return (
            <TableRow>
                <TableCell align="left">
                    {player !== null && <Typography>{player.name}</Typography>}
                </TableCell>
                <TableCell align="center">

                    {player !== null && <img alt={`Rank image ${predictedRanks[player.id]}`}
                                             src={`${window.location.origin}/ranks/${predictedRanks[player.id]}.png`}
                                             style={{width: 48, height: 48, margin: "auto"}}/>}
                </TableCell>
                <TableCell align="center">
                    {playerRight !== null && <img alt={`Rank image ${predictedRanks[playerRight.id]}`}
                         src={`${window.location.origin}/ranks/${predictedRanks[playerRight.id]}.png`}
                         style={{width: 48, height: 48, margin: "auto"}}/>}
                </TableCell>
                <TableCell align="right">
                    {playerRight !== null && <Typography>{playerRight.name}</Typography>}
                </TableCell>
            </TableRow>
        )
    }

    // private createTeamTitle(title: string) {
    //     return (
    //         <TableRow>
    //             <TableCell>
    //                 <Typography variant="h4">{title}</Typography>
    //             </TableCell>
    //         </TableRow>
    //     )
    // }

    private createTable(rows: any) {
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
