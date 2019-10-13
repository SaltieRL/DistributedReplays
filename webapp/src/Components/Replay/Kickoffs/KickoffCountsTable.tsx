import {
    FormControlLabel,
    Paper, Switch,
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
}

const HEADERS = ['jumps', 'boost_level', 'ball_distance', 'location']
const HEADERS_NAMES = ['Jumps', 'Boost Level', 'Ball Distance', 'location']

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
                                <TableCell>Kickoff</TableCell>
                                {HEADERS.map((playerId: string, index: number) => (
                                    <TableCell align="right" key={playerId}>{HEADERS_NAMES[index]}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.players.map((player_id: any, i: number) => (
                                <TableRow
                                    key={name}
                                    selected={this.props.highlight === i}
                                >
                                    <TableCell component="th" scope="row">
                                        {name}
                                    </TableCell>
                                    {this.props.replay.players.map((player) => (
                                        <TableCell key={player.name + name} align="right">
                                            {this.props.data[i].map((point: any) =>
                                                point.playerName === player.name ? 1 : 0
                                            ).reduce((acc: number, a: number) => acc + a, 0)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        )
    }
}
