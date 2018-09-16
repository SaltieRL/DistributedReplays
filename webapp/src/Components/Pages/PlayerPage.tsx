import {Grid} from "@material-ui/core"
import * as React from "react"
import {RouteComponentProps} from "react-router-dom"
import {getPlayer} from "../../Requests/Player"
import {PlayerSideBar} from "../Player/Overview/SideBar/PlayerSideBar"
import {PlayerView} from "../Player/PlayerView"
import {LoadableComponent} from "../Shared/LoadableComponent"
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
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <LoadableComponent load={this.getPlayerForPage} reloadSignal={this.state.reloadSignal}>
                        {this.state.player &&
                        <>
                            <Grid item xs={12} sm={5} md={3} style={{maxWidth: 400}}>
                                <PlayerSideBar player={this.state.player}/>
                            </Grid>
                            <Grid item xs={12} sm={7} md={9}>
                                <PlayerView player={this.state.player}/>
                            </Grid>
                        </>
                        }
                    </LoadableComponent>
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
