import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography
} from "@material-ui/core"
import * as React from "react"
import {IconTooltip} from "../../../Shared/IconTooltip"

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
        message: "Duration spent between your goal and the ball"
    },
    {
        statName: "> ball",
        message: "Duration spent between the enemy goal and the ball"
    },
    {
        statName: "boost efficiency",
        message: "(Wasted collected boost + wasted boost at speed) / (boost used)"
    }
]

interface State {
    dialogOpen: boolean
}

export class PlayerPlayStyleCard extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {dialogOpen: false}
    }

    public render() {
        /* tslint:disable */
        const playStyleTitle =
            <Typography variant="headline">
                Playstyle
                <IconTooltip tooltip="Data is presented as standard deviations from the mean, and only includes games from the past 6 months"/>
            </Typography>
        /* tslint:enable */

        const playStyleAction =
            <>
                <Button variant="outlined"
                        onClick={this.handleOpen}
                        style={{marginRight: 8}}
                >
                    What are these stats?
                </Button>
                <Dialog open={this.state.dialogOpen}
                        onClose={this.handleClose}
                        scroll="paper"
                >
                    <DialogTitle>Explanation of terms</DialogTitle>
                    <DialogContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Stat</TableCell>
                                    <TableCell>Explanation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {explanations.map((explanation) => (
                                    <TableRow>
                                        <TableCell>{explanation.statName}</TableCell>
                                        <TableCell>{explanation.message}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                </Dialog>
            </>

        return (
            <Card>
                <CardHeader title={playStyleTitle} action={playStyleAction}/>
                <CardContent>
                    {this.props.children}
                </CardContent>
            </Card>
        )
    }

    private readonly handleOpen = () => {
        this.setState({dialogOpen: true})
    }

    private readonly handleClose = () => {
        this.setState({dialogOpen: false})
    }
}
