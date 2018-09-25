import {Grid} from "@material-ui/core"
import * as React from "react"
import {Redirect, Route, RouteComponentProps, Switch} from "react-router-dom"
import {getPlayer} from "../../Requests/Player"
import {PlayerDetailsView} from "../Player/PlayerDetailsView"
import {PlayerMatchHistoryView} from "../Player/PlayerMatchHistoryView"
import {PlayerOverview} from "../Player/PlayerOverview"
import {LoadableWrapper} from "../Shared/LoadableWrapper"
import {BasePage} from "./BasePage"

interface RouteParams {
    id: string
}

type Props = RouteComponentProps<RouteParams>

interface State {
    player?: Player
    reloadSignal: boolean
}

export class PlayerPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.triggerReload()
        }
    }

    public render() {
        const matchUrl = this.props.match.url
        const overviewPath = matchUrl + "/overview"
        const matchHistoryPath = matchUrl + "/match_history"
        const detailedPath = matchUrl + "/details"

        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <LoadableWrapper load={this.getPlayerForPage} reloadSignal={this.state.reloadSignal}>
                        {this.state.player &&
                        <Switch>
                            <Route path={overviewPath}
                                   render={() => <PlayerOverview player={this.state.player as Player}/>}/>
                            <Route path={matchHistoryPath}
                                   render={() => <PlayerMatchHistoryView player={this.state.player as Player}/>}/>
                            <Route path={detailedPath}
                                   render={() => <PlayerDetailsView player={this.state.player as Player}/>}/>
                            <Redirect from="*" to={overviewPath}/>
                        </Switch>
                        }
                    </LoadableWrapper>
                </Grid>
            </BasePage>
        )
    }

    private readonly getPlayerForPage = (): Promise<void> => {
        return getPlayer(this.props.match.params.id)
            .then((player) => this.setState({player}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }
}
