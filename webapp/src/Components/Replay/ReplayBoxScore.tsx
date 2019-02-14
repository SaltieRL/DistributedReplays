import {
    createStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    withStyles,
    WithStyles
} from "@material-ui/core"
import Grid from "@material-ui/core/Grid/Grid"
import * as React from "react"
import { Replay } from "../../Models"

interface BoxScoreData {
    name: "Blue" | "Orange",
    score: number,
    players: ReplayPlayer[]
}

const labelToKeys = new Map<string, keyof ReplayPlayer>()
    .set("Player", "name")
    .set("Score", "score")
    .set("Goals", "goals")
    .set("Assists", "assists")
    .set("Saves", "saves")
    .set("Shots", "shots")

interface OwnProps {
    replay: Replay
    player?: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>

export class ReplayBoxScoreComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <Grid container style={{minWidth: "400px"}}>
                {this.getBars()}
            </Grid>
        )
    }

    private readonly getBars = () => {
        const {replay} = this.props

        const blueBoxScoreTeamData: BoxScoreData = {
            name: "Blue",
            score: replay.gameScore.team0Score,
            players: replay.players.filter((player: ReplayPlayer) => !player.isOrange)
        }
        const orangeBoxScoreTeamData: BoxScoreData = {
            name: "Orange",
            score: replay.gameScore.team1Score,
            players: replay.players.filter((player: ReplayPlayer) => player.isOrange)
        }

        return (
            <Grid container justify="center" spacing={16}>
                {[blueBoxScoreTeamData, orangeBoxScoreTeamData].map(this.createTeamBoxScoreGridItem)}
            </Grid>

        )
    }

    private readonly createTeamBoxScoreGridItem = (boxScoreData: BoxScoreData) => (
        <Grid item xs={12} key={boxScoreData.name}>
            <Table key={boxScoreData.name} padding="dense" className={this.props.classes.teamTable}>
                {this.createTableHead(boxScoreData)}
                {this.createTableBody(boxScoreData)}
            </Table>
        </Grid>
    )

    private readonly createTableHead = (boxScoreData: BoxScoreData) => {
        const classes = this.props.classes
        return (
            <TableHead className={boxScoreData.name === "Blue" ? classes.blueTableHead : classes.orangeTableHead}>
                <TableRow>
                    <TableCell style={{width: "30%"}} padding="dense">
                        <Typography variant="title" className={classes.teamName}>
                            {boxScoreData.score} {boxScoreData.name}
                        </Typography>
                    </TableCell>
                    {Array.from(labelToKeys, ([label, key]) => {
                        if (key !== "name") {
                            return (
                                <TableCell numeric key={key} padding="dense">
                                    <Typography variant="subheading">
                                        {label}
                                    </Typography>
                                </TableCell>
                            )
                        }
                        return null
                    })}
                </TableRow>
            </TableHead>
        )
    }

    private readonly createTableBody = (boxScoreData: BoxScoreData) => {
        return (
            <TableBody>
                {boxScoreData.players
                    .sort((playerA: ReplayPlayer, playerB: ReplayPlayer) =>
                        playerB.score - playerA.score)
                    .map((player: ReplayPlayer) => (
                        <TableRow key={player.id}>
                            {Array.from(labelToKeys, ([label, key]) => (
                                <TableCell key={key}
                                           numeric={key !== "name"}
                                           className={this.props.classes.tableData}
                                           padding="dense"
                                >
                                    {(this.props.player && player.id === this.props.player.id) ?
                                        <b>{player[key]}</b>
                                        :
                                        player[key]
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
            </TableBody>
        )
    }
}

const styles = createStyles({
    teamTable: {
        maxWidth: 800,
        margin: "auto"
    },
    teamName: {
        textTransform: "uppercase"
    },
    tableData: {
        fontWeight: 400
    },
    blueTableHead: {
        borderBottom: "2px solid cornflowerblue"
    },
    orangeTableHead: {
        borderBottom: "2px solid orange"
    }
})

export const ReplayBoxScore = withStyles(styles)(ReplayBoxScoreComponent)
