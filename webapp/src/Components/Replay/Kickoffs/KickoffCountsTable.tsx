import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"

interface Props {
    kickoff: any
    players: any
    replay: Replay
    highlight: 0
}

const HEADERS = ['location', 'jumps', 'boost_level', 'ball_distance']
const HEADERS_NAMES = ['Target', 'Jumps', 'Boost Level at First Touch', 'Distance to Ball at First Touch']

export class KickoffCountsTable extends React.PureComponent<Props> {
    public render() {
        const toolbar = (
            <Toolbar>
                <div style={{flex: "0 0 auto"}}>
                    <Typography variant="h6" id="tableTitle">
                        Kickoff Counts
                    </Typography>
                </div>
                <div style={{flex: "1 1 100%"}}/>
                <div style={{color: "#ccc"}}>
                </div>
            </Toolbar>
        )

        return (
            <Paper>
                {toolbar}
                <div style={{overflowX: "auto"}}>
                    <Table padding="checkbox">
                        <TableHead>
                            <TableRow>
                                <TableCell>Player Name</TableCell>
                                {HEADERS.map((headerKey: string, index: number) => (
                                    <TableCell align="center" key={headerKey}>{HEADERS_NAMES[index]}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.kickoff.players.map((player_info: any, index: number) => (
                                <TableRow
                                    key={player_info.player_id}
                                    selected={this.props.highlight === index}
                                >
                                    <TableCell component="th" scope="row">
                                        {this.props.players[player_info.player_id].name}
                                    </TableCell>
                                    {HEADERS.map((headerKey) => {
                                        console.log(player_info)
                                        console.log(this.props.kickoff.players[index])
                                        console.log(player_info[headerKey])
                                        console.log(this.props.players[player_info.player_id])
                                        return (<TableCell key={headerKey + player_info.player_id} align="center">
                                                {
                                                    player_info[headerKey]
                                                }
                                                </TableCell>)
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        )
    }
}
