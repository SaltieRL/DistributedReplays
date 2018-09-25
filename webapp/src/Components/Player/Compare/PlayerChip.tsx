import {Avatar, Chip} from "@material-ui/core"
import * as React from "react"

interface Props extends Player {
    onDelete: () => void
}

export class PlayerChip extends React.PureComponent<Props> {
    public render() {
        return (
            <Chip
                avatar={<Avatar src={this.props.avatarLink}/>}
                label={this.props.name}
                onDelete={this.props.onDelete}/>
        )
    }
}
