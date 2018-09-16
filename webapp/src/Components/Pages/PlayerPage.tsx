import {Grid} from "@material-ui/core"
import * as React from "react"
import {RouteComponentProps} from "react-router-dom"
import {getPlayer} from "../../Requests/Player"
import {PlayerSideBar} from "../Player/Overview/SideBar/PlayerSideBar"
import {PlayerView} from "../Player/PlayerView"
import {BasePage} from "./BasePage"


interface RouteParams {
    id: string
}

type Props = RouteComponentProps<RouteParams>

interface State {
    player?: Player
}


export class PlayerPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        this.getPlayerForPage()
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getPlayerForPage()
        }
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
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
                </Grid>
            </BasePage>
        )
    }

    private getPlayerForPage() {
        getPlayer(this.props.match.params.id)
            .then((player) => this.setState({player}))
    }
}
