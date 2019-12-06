import {Avatar, Chip, createStyles, Typography, withStyles, WithStyles} from "@material-ui/core"
import * as React from "react"
import {RouteComponentProps, withRouter} from "react-router"
import {PLAYER_PAGE_LINK} from "../../../Globals"

const styles = createStyles({
    root: {
        maxWidth: "100%"
    },
    label: {
        maxWidth: "calc(100% - 48px)"
    }
})

interface OwnProps extends Player {
    onDelete: () => void
}

type Props = OwnProps & RouteComponentProps<{}> & WithStyles<typeof styles>

class PlayerChipComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <Chip
                avatar={<Avatar src={this.props.avatarLink} />}
                label={
                    <Typography noWrap variant="inherit">
                        {this.props.name}
                    </Typography>
                }
                onDelete={this.props.onDelete}
                onClick={this.onClick}
                classes={{label: this.props.classes.label}}
                className={this.props.classes.root}
            />
        )
    }

    private readonly onClick = () => {
        this.props.history.push(PLAYER_PAGE_LINK(this.props.id))
    }
}

export const PlayerChip = withStyles(styles)(withRouter(PlayerChipComponent))
