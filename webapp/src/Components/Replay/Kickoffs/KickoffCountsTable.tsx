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
                                {HEADERS.map((headerKey: string, index: number) => (
                                    <TableCell align="right" key={headerKey}>{HEADERS_NAMES[index]}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(this.props.players).map((player_id: string, i: number) => (
                                <TableRow
                                    key={player_id}
                                    selected={this.props.highlight === i}
                                >
                                    <TableCell component="th" scope="row">
                                        {this.props.players[player_id].name}
                                    </TableCell>
                                    {HEADERS.map((headerKey) => (
                                        <TableCell key={headerKey + player_id} align="right">
                                            {this.props.players[player_id][headerKey]}
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
