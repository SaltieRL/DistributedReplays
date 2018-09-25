import {Avatar, Chip} from "@material-ui/core"
import * as React from "react"
import {Redirect} from "react-router"
import {PLAYER_PAGE_LINK} from "../../../Globals"

interface Props extends Player {
    onDelete: () => void
}

interface State {
    redirect: boolean
}

export class PlayerChip extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            redirect: false
        }
    }

    public render() {
        return (
            <>
                {
                    <Chip
                        avatar={<Avatar src={this.props.avatarLink}/>}
                        onClick={this.handleClick}
                        label={this.props.name}
                        onDelete={this.props.onDelete}/>
                }
                {
                    this.state.redirect &&
                    <Redirect to={PLAYER_PAGE_LINK(this.props.id)}/>
                }
            </>
        )
    }

    private readonly handleClick = () => {
        this.setState({
            redirect: true
        })
    }

}
