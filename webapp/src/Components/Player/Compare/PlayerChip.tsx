import {Avatar, Chip} from "@material-ui/core"
import * as React from "react"
import {RouteComponentProps, withRouter} from "react-router"
import {PLAYER_PAGE_LINK} from "../../../Globals"

interface OwnProps extends Player {
    onDelete: () => void
}

type Props = OwnProps
    & RouteComponentProps<{}>

class PlayerChipComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <Chip
                avatar={<Avatar src={this.props.avatarLink}/>}
                label={this.props.name}
                onDelete={this.props.onDelete}
                onClick={this.onClick}
            />
        )
    }

    private readonly onClick = () => {
        this.props.history.push(PLAYER_PAGE_LINK(this.props.id))
    }

}

export const PlayerChip = withRouter(PlayerChipComponent)
