import {Card, CardContent, CardHeader} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../../Models/Replay/Replay"
import {getMatchHistory} from "../../../../Requests/Player"
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
        this.getPlayerMatchHistory()
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.player.id !== this.props.player.id) {
            this.getPlayerMatchHistory()
        }
    }

    public render() {
        return (
            <Card>
                <CardHeader title="Match History"/>
                <CardContent>
                    {this.state.matchHistory &&
                    this.state.matchHistory.map((replay) =>
                        <MatchHistoryRow replay={replay} player={this.props.player} key={replay.name}/>)
                    }
                </CardContent>
            </Card>
        )
    }

    private readonly getPlayerMatchHistory = () => {
        getMatchHistory(this.props.player.id)
            .then((matchHistory) => this.setState({matchHistory}))
    }
}
