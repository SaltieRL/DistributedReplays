import { Chip } from "@material-ui/core"
import * as React from "react"
import { RouteComponentProps, withRouter } from "react-router"
import { REPLAY_PAGE_LINK } from "../../Globals"
import { Replay } from "../../Models"

interface OwnProps extends Replay {
    onDelete: () => void
}

type Props = OwnProps
    & RouteComponentProps<{}>

class ReplayChipComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <Chip
                label={`${this.props.name}: ${this.props.id}`}
                onDelete={this.props.onDelete}
                onClick={this.onClick}
            />
        )
    }

    private readonly onClick = () => {
        this.props.history.push(REPLAY_PAGE_LINK(this.props.id))
    }

}

export const ReplayChip = withRouter(ReplayChipComponent)
