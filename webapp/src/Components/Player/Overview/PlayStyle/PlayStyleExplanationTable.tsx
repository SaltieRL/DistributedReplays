import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
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
        statName: "Turnover Efficiency",
        message: "Giving the ball away to the opponent divided by the number of hits"
    },
    {
        statName: "Att & Def 1/2 & 1/3",
        message: "Short for Attacking & Defensive, Half & Third respectively.  This is time you spent in that area."
    },
    {
        statName: "< ball",
        message: "Duration spent between your goal and the ball"
    },
    {
        statName: "> ball",
        message: "Duration spent between the enemy goal and the ball"
    },
    {
        statName: "Total Boost Efficiency",
        message: "(Wasted collected boost + wasted boost at speed) / (boost used + boost collected)"
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
