import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core"
import * as React from "react"

interface Explanation {
    statName: string
    message: string
}

const explanations: Explanation[] = [
    {
        statName: "Possession",
        message: "Duration the ball was last touched by player"
    },
    {
        statName: "Useful",
        message: "Short for \"Useful Hit\", refers to hits that are passes, shots, or dribbles - " +
            "basically anything that's not giving the ball away."
    },
    {
        statName: "Turnovers",
        message: "Giving the ball away to the opponent"
    },
    {
        statName: "Att & Def 1/2 & 1/3",
        message: "Short for Attacking & Defensive, Half & Third respectively."
    },
    {
        statName: "< ball",
        message: "Duration spent behind the ball"
    },
    {
        statName: "> ball",
        message: "Duration spent ahead of the ball"
    }
]

export class PlayStyleExplanationTable extends React.PureComponent {
    public render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="dense">Stat</TableCell>
                        <TableCell>Explanation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {explanations.map((explanation) => (
                        <TableRow>
                            <TableCell padding="dense">{explanation.statName}</TableCell>
                            <TableCell>{explanation.message}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
}
