import {Card, CardContent, CardHeader, Table, TableBody} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../Models/Replay/Replay"
import {getMatchHistory} from "../../../Requests/Player"
import {MatchHistoryRow} from "./MatchHistoryRow"


interface Props {
    player: Player
}

interface State {
    matchHistory?: Replay[]
}

export class PlayerMatchHistory extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        getMatchHistory(this.props.player.id)
            .then((matchHistory) => this.setState({matchHistory}))
    }

    public render() {
        return (
            <Card>
                <CardHeader title="Match History"/>
                <CardContent>
                    {this.state.matchHistory &&
                    <Table>
                        <TableBody>
                            {this.state.matchHistory.map((replay) =>
                                <MatchHistoryRow replay={replay} key={replay.name}/>
                            )}
                        </TableBody>
                    </Table>
                    }
                </CardContent>
            </Card>
        )
    }
}
