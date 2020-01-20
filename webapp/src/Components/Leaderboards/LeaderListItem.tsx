import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core"
import * as React from "react"
import {Link, LinkProps} from "react-router-dom"
import {PLAYER_PAGE_LINK} from "../../Globals"

interface Props {
    leader: Leader
}

export class LeaderListItem extends React.PureComponent<Props> {
    private readonly createLink = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, "innerRef" | "to">>(
        (props, ref) => <Link to={PLAYER_PAGE_LINK(this.props.leader.id_)} {...props} innerRef={ref} />
    )

    public render() {
        const {leader} = this.props
        return (
            <ListItem key={leader.id_} button component={this.createLink}>
                <ListItemAvatar>
                    <Avatar alt={`Avatar ${leader.name}`} src={leader.avatar} />
                </ListItemAvatar>
                <ListItemText primary={leader.name} primaryTypographyProps={{noWrap: true}} secondary={leader.count} />
            </ListItem>
        )
    }
}
