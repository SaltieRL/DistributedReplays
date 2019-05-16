import {
    FormControlLabel,
    Grid,
    Paper,
    Switch,
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
import { BoostField } from "./BoostField"

interface Props {
    data: any
    replay: Replay
}

interface State {
    rotateCharts: boolean
    highlight: number
}

export class BoostMapWrapper extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {rotateCharts: false, highlight: -1}
    }

    public render() {
        const {data, replay} = this.props
        const ratios = data.map((pad: any) => {
            const totalCount = pad.length
            const blueCount = pad.filter((pickup: any) => pickup.playerTeam === 0).length
            const orangeCount = totalCount - blueCount
            return [blueCount / totalCount, orangeCount / totalCount]
        })
        const boostNames = [
            "Blue Top",
            "Mid Top",
            "Orange Top",
            "Blue Bottom",
            "Mid Bottom",
            "Orange Bottom"
        ]

        const EnhancedTableToolbar = (props: any) => {
            return (
                <Toolbar>
                    <div style={{flex: "0 0 auto"}}>
                        <Typography variant="h6" id="tableTitle">
                            Boost Counts
                        </Typography>
                    </div>
                    <div style={{flex: "1 1 100%"}}/>
                    <div style={{color: "#ccc"}}>

                        <FormControlLabel
                            control={<Switch checked={this.state.rotateCharts} onClick={this.toggleRotate}/>}
                            label="Graph rotation"
                        />
                    </div>
                </Toolbar>
            )
        }

        return (
            <Grid container justify={"center"}>
                <Grid item xs={4} style={{padding: "40px"}}>
                    <BoostField key={this.state.rotateCharts ? 1 : 0}
                                data={
                                    ratios
                                }
                                rotationEnabled={this.state.rotateCharts}
                    onMouseover={this.onMouseover}
                    onMouseout={this.onMouseout}/>
                </Grid>
                <Grid item xs={8} style={{padding: "40px"}}>
                    <Grid item xs={12}>
                        <Paper>
                            <EnhancedTableToolbar/>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Boost</TableCell>
                                        {replay.players.map((player) => (
                                            <TableCell align="right" key={player.name}>{player.name}</TableCell>))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {boostNames.map((name, i) => (
                                        <TableRow key={i}
                                                  style={{backgroundColor: this.state.highlight === i ? "#eee" : "white"}}>
                                            <TableCell component="th" scope="row">
                                                {name}
                                            </TableCell>
                                            {replay.players.map((player) => (
                                                <TableCell
                                                    align="right">
                                                    {data[i].map((point: any) =>
                                                        point.playerName === player.name ? 1 : 0
                                                    ).reduce((acc: number, a: number) => acc + a, 0)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    public toggleRotate = () => {
        this.setState({rotateCharts: !this.state.rotateCharts})
    }

    public onMouseover = (index: number, data: any) => {
        this.setState({highlight: index})
    }
    public onMouseout = (index: number, data: any) => {
        this.setState({highlight: -1})
    }

}
