import { Avatar, ListItem, ListItemText } from "@material-ui/core"
import * as React from "react"
import { Link } from "react-router-dom"
import { PLAYER_PAGE_LINK } from "../../Globals"

interface EsportsPlayerProps {
    player: EsportsPlayer
    team: string
}

interface EsportsPlayer {
    name: string
    id: string
    sub: number
}

export class EsportsPlayerListItem extends React.PureComponent<EsportsPlayerProps> {
    public render() {
        const {player, team} = this.props
        return (
            <Link to={PLAYER_PAGE_LINK(player.id)} style={{textDecoration: "none"}}>
                <ListItem button key={player.id}>
                    <Avatar src={`/team-logos/${team}.png`}/>
                    <ListItemText primary={player.name}/>
                </ListItem>
            </Link>
        )
    }
}
