import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core"
import Delete from "@material-ui/icons/Delete"
import * as React from "react"
import { withNotifications, WithNotifications } from "../Notification/NotificationUtils"
import { CreateTagDialog } from "./CreateTagDialog"

interface OwnProps {
    tags: Tag[]
    handleCreate: (tag: Tag) => void
    deleteTag: (tag: Tag) => () => void
}

type Props = OwnProps & WithNotifications

class UserTagDisplayComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <List>
                    {this.props.tags.map((tag) => (
                        <ListItem
                            key={tag.name}
                            button
                        >
                            <ListItemText
                                primary={tag.name}
                                primaryTypographyProps={{noWrap: true}}
                            />
                            <ListItemSecondaryAction>
                                <IconButton onClick={this.props.deleteTag(tag)}>
                                    <Delete/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <CreateTagDialog onCreate={this.props.handleCreate}/>
            </>
        )
    }
}

export const UserTagDisplay = withNotifications()(UserTagDisplayComponent)
