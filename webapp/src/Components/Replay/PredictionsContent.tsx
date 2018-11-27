import {
    CardContent,
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core"
import * as React from "react"
import { PlayerStatsSubcategory, Replay } from "src/Models"

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
        const {replay} = this.props
        const blueTeam =
            replay.players.filter((player) => !player.isOrange).map(this.createRow.bind(this))
        const orangeTeam =
            replay.players.filter((player) => player.isOrange).map(this.createRow.bind(this))
        return (
            <>
                <Divider/>
                <CardContent>
                    <Grid container spacing={32}>
                        <Grid item xs={12}>
                            <Typography variant="display2" gutterBottom>Blue</Typography>
                            {this.createTable("Blue", blueTeam)}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="display2" gutterBottom>Orange</Typography>
                            {this.createTable("Orange", orangeTeam)}
                        </Grid>
                    </Grid>
                </CardContent>
            </>
        )
    }

    private createRow(player: any) {
        const {predictedRanks} = this.props
        return <TableRow>
            <TableCell>
                {player.name}
            </TableCell>
            <TableCell>

                <img alt={`Rank image ${predictedRanks[player.id]}`}
                     src={`${window.location.origin}/ranks/${predictedRanks[player.id]}.png`}
                     style={{width: 48, height: 48, margin: "auto"}}/>
            </TableCell>
        </TableRow>
    }

    private createTable(team: string, players: any) {
        return <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Player
                    </TableCell>
                    <TableCell>
                        Predicted Play Level
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {players}
            </TableBody>
        </Table>
    }
}
