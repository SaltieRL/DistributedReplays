import {Grid} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../../Models/Replay/Replay"
import {getMatchHistory} from "../../../../Requests/Player"
import {LoadableWrapper} from "../../../Shared/LoadableWrapper"
import {MatchHistoryRow} from "./MatchHistoryRow"

interface Props {
    player: Player
    useBoxScore: boolean
    useHeader?: boolean
}

interface State {
    matchHistory?: Replay[]
    reloadSignal: boolean
}

export class PlayerMatchHistory extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.player.id !== this.props.player.id) {
            this.triggerReload()
        }
    }

    public render() {
        return (
            <Grid container>
                {this.props.useHeader &&
                <Grid item xs={12}>
                    <MatchHistoryRow header/>
                </Grid>
                }
                <Grid item xs={12}>
                    <LoadableWrapper load={this.getPlayerMatchHistory} reloadSignal={this.state.reloadSignal}>
                        {this.state.matchHistory &&
                        this.state.matchHistory.map((replay) =>
                            <MatchHistoryRow replay={replay} player={this.props.player} key={replay.name}
                                             useBoxScore={this.props.useBoxScore}/>)
                        }
                    </LoadableWrapper>
                </Grid>
            </Grid>
        )
    }

    private readonly getPlayerMatchHistory = (): Promise<void> => {
        return getMatchHistory(this.props.player.id)
            .then((matchHistory) => this.setState({matchHistory}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }
}
