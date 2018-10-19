import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import * as React from "react"
import { PlayStyleRawResponse } from "../../../../Models/Player/PlayStyle"

interface Props {
    rawPlayers: PlayStyleRawResponse[]
    names: string[]
}

interface State {

}

export class PlayerCompareTable extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        // this.state = {currentSort: {statName: "hits", direction: "desc"}}
    }

    public render() {
        const {names} = this.props
        const header = (
            <TableRow>
                <TableCell>Stat</TableCell>
                {names.map((player) =>
                    <>
                        <TableCell>{player}</TableCell>

                    </>)}
            </TableRow>
        )
        if (this.props.rawPlayers.length > 0) {
            const categories = this.props.rawPlayers[0].dataPoints.map((point) => point.name)
            return (
                <Table>
                    <TableHead>
                        {header}
                    </TableHead>
                    <TableBody>

                        {categories.map((category, i) =>
                            <TableRow key={category}>
                                <TableCell>
                                    {category}
                                </TableCell>
                                {this.props.rawPlayers.map((player) =>
                                    <TableCell key={player.name}>
                                        {player.dataPoints[i].average.toFixed(2)}
                                    </TableCell>)}
                            </TableRow>)}
                    </TableBody>
                </Table>
            )
        } else {
            return ""
        }
    }
}
