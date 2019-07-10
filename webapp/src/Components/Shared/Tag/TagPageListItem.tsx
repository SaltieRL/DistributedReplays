import { faTags } from "@fortawesome/free-solid-svg-icons/faTags"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Tooltip } from "@material-ui/core"
import Edit from "@material-ui/icons/Edit"
import FileCopy from "@material-ui/icons/FileCopy"
import Refresh from "@material-ui/icons/Refresh"
import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { TagsAction } from "../../../Redux"
import { generateTagPrivateIdAndGetKey } from "../../../Requests/Tag"

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addPrivateKeyToTagAction: (tag: TagWithPrivateKey) => dispatch(TagsAction.addPrivateKeyToTagAction(tag))
})

interface OwnProps {
    tag: TagWithPrivateKey
}

type Props = OwnProps
    & ReturnType<typeof mapDispatchToProps>

class TagPageListItemComponent extends React.PureComponent<Props> {
    public render() {
        const tag = this.props.tag
        const hasPrivateKey = tag.privateKey !== null
        return (
            <ListItem>
                <ListItemIcon>
                    <FontAwesomeIcon icon={faTags}/>
                </ListItemIcon>
                <ListItemText primary={tag.name}
                              secondary={tag.privateKey}/>
                <ListItemSecondaryAction>
                    {hasPrivateKey && (
                        <Tooltip
                            title="Copy private key to clipboard. The private key allows others to upload replays to this tag.">
                            <IconButton onClick={this.copyPrivateKeyToClipboard}>
                                <FileCopy/>
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip
                        title={hasPrivateKey ? "Generate new private ID." : "Generate private ID."}>
                        <IconButton onClick={this.generatePrivateID} style={hasPrivateKey ? {opacity: 0.7} : undefined}>
                            <Refresh/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Rename">
                        <IconButton disabled><Edit/></IconButton>
                    </Tooltip>
                    {/*TODO: Enable tag rename functionality*/}
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    private readonly generatePrivateID = () => {
        const tag = this.props.tag
        generateTagPrivateIdAndGetKey(tag)
            .then((privateKey) => ({...tag, privateKey}))
            .then(this.props.addPrivateKeyToTagAction)
    }

    private readonly copyPrivateKeyToClipboard = () => {
        const tag = this.props.tag

        if (tag.privateKey !== null) {
            (navigator as any).clipboard.writeText(tag.privateKey)
        }
    }
}

export const TagPageListItem = connect(null, mapDispatchToProps)(TagPageListItemComponent)
