import {Avatar, Chip} from "@material-ui/core"
import * as React from "react"
import {PLAYER_PAGE_LINK} from "../../../Globals"

interface Props extends Player {
    onDelete: () => void
}

export class PlayerChip extends React.PureComponent<Props> {
    public render() {
        return (
            <Chip
                avatar={<Avatar src={this.props.avatarLink}/>}
                label={this.props.name}
                onDelete={this.props.onDelete}
                {...({
                    href: PLAYER_PAGE_LINK(this.props.id),
                    component: "a"
                })}
                clickable
            />
        )
    }

}
