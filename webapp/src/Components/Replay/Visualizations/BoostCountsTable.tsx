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
    replay: Replay
    data: any
    boostNames: string[]
    rotateCharts: boolean
    toggleRotate: () => void
    highlight: number
}

export class BoostCountsTable extends React.PureComponent<Props> {
    public render() {
        const toolbar = (
            <Toolbar>
                <div style={{flex: "0 0 auto"}}>
                    <Typography variant="h6" id="tableTitle">
                        Boost Counts
                    </Typography>
                </div>
                <div style={{flex: "1 1 100%"}}/>
                <div style={{color: "#ccc"}}>
                    <FormControlLabel
                        control={<Switch checked={this.props.rotateCharts} onClick={this.props.toggleRotate}/>}
                        label="Graph rotation"
                    />
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
                                <TableCell>Boost</TableCell>
                                {this.props.replay.players.map((player) => (
                                    <TableCell align="right" key={player.name}>{player.name}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.boostNames.map((name, i) => (
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
