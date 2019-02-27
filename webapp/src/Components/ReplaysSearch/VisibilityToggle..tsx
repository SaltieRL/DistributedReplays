import { IconButton } from "@material-ui/core"
import { SvgIconProps } from "@material-ui/core/SvgIcon"
import { VisibilityOff } from "@material-ui/icons"
import Visibility from "@material-ui/icons/Visibility"
import * as React from "react"
import { GameVisibility, Replay } from "../../Models"
import { setVisibility } from "../../Requests/Replay"

interface Props {
    replay: Replay
}

interface State {
    overwriteVisibility?: GameVisibility
}

export class VisibilityToggle extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        const Icon = this.getIcon()
        // TODO: Standardise styles (making icon smaller) with TagDialogWrapper's icon
        return (
            <IconButton style={{padding: 4}} onClick={this.toggleVisibility}>
                <Icon style={{height: 22.5}}/>
            </IconButton>
        )
    }

    private readonly getIcon = (): React.ComponentType<SvgIconProps> => {
        const visibility: GameVisibility = this.state.overwriteVisibility || this.props.replay.visibility
        switch (visibility) {
            case GameVisibility.DEFAULT:
            case GameVisibility.PUBLIC:
                return Visibility
            case GameVisibility.PRIVATE:
                return VisibilityOff
            default:
                // TODO: Raise/handle error?
                throw new Error(`Unknown visibility ${visibility}`)
        }
    }

    private readonly toggleVisibility = () => {
        const visibility: GameVisibility = this.state.overwriteVisibility || this.props.replay.visibility
        const newVisibility = visibility === GameVisibility.PRIVATE ? GameVisibility.PUBLIC : GameVisibility.PRIVATE
        setVisibility(this.props.replay.id, newVisibility)
            .then((visibilityResponse) => this.setState({overwriteVisibility: visibilityResponse.visibility}))
    }
}
