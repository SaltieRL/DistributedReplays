import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../../Models"

interface Props {
    kickoff: Kickoff
    players: KickoffPlayers
    replay: Replay
    highlight?: number
}

const HEADERS = ["location", "jumps", "boost_level", "ball_distance"]
const HEADERS_NAMES = ["Target", "Jumps", "Boost Level at First Touch", "Distance to Ball at First Touch"]

export class KickoffCountsTable extends React.PureComponent<Props> {
    public render() {
        return (
            <div style={{overflowX: "auto"}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Player Name</TableCell>
                            {HEADERS.map((headerKey: string, index: number) => (
                                <TableCell align="center" key={headerKey}>
                                    {HEADERS_NAMES[index]}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.kickoff.players.map((playerInfo, index: number) => (
                            <TableRow key={playerInfo.player_id} selected={this.props.highlight === index}>
                                <TableCell component="th" scope="row">
                                    {this.props.players[playerInfo.player_id].name}
                                </TableCell>
                                {HEADERS.map((headerKey) => (
                                    <TableCell key={headerKey + playerInfo.player_id} align="center">
                                        {playerInfo[headerKey]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }
}
