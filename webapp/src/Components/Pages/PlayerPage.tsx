import {Grid} from "@material-ui/core"
import * as React from "react"
import {RouteComponentProps} from "react-router-dom"
import {PlayerView} from "../Player/PlayerView"
import {PlayerSideBar} from "../Player/sidebar/PlayerSideBar"
import {BasePage} from "./BasePage"


interface OwnProps {
    id: string
}

type Props = RouteComponentProps<OwnProps>

interface State {
    player: Player
}


export class PlayerPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {player: this.getPlayer()}
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12} sm={5} md={3} style={{maxWidth: 400}}>
                        <PlayerSideBar player={this.state.player}/>
                    </Grid>
                    <Grid item xs={12} sm={7} md={9}>
                        <PlayerView player={this.state.player}/>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly getPlayer = (): Player => {
        return {
            name: "Name",
            profileLink: this.props.match.params.id,
            platform: "Steam",
            avatarLink: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a5/a541aa2146a49c396aa9e159fc176c2799ab231e_full.jpg"
        }
    }
}
