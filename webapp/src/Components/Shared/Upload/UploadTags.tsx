import {
    Chip,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select, Tooltip,
    Typography
} from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import * as React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Dispatch } from "redux"
import { TAGS_PAGE_LINK } from "../../../Globals"
import { StoreState, TagsAction } from "../../../Redux"
import { getAllTagsWithPrivateKeys } from "../../../Requests/Tag"
import { AddTagPrivateKeyDialog } from "./AddTagPrivateKeyDialog."

const mapStateToProps = (state: StoreState) => ({
    tags: state.tags
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
    setTags: (tags: TagWithPrivateKey[]) => dispatch(TagsAction.setTagsAction(tags))
})

interface OwnProps {
    selectedPrivateKeys: string[]
    handlePrivateKeysChange: (selectedPrivateKeys: string[]) => void
}

type Props = OwnProps
    & ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>

interface State {
    externalPrivateKeys: string[]
    addExternalKeyDialogOpen: boolean
}

class UploadTagsComponent extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {externalPrivateKeys: [], addExternalKeyDialogOpen: false}
    }

    public componentDidMount() {
        getAllTagsWithPrivateKeys()
            .then((tags) => this.props.setTags(tags))
    }

    public render() {
        const tags = this.props.tags
        const selectedTagNames = this.props.selectedPrivateKeys.map(this.findTagNameFromPrivateKey)
        let tagsWithPrivateKeys = (tags !== null ? tags.filter((tag) => tag.privateKey !== null) : [])
            .map((tag) => tag.name)
        tagsWithPrivateKeys = [...tagsWithPrivateKeys, ...this.state.externalPrivateKeys]

        return (
            <>
                {tags !== null && (
                    <Grid container spacing={8}>
                        <Grid item xs={11}>
                            <FormControl fullWidth>
                                <InputLabel>Tags</InputLabel>
                                <Select
                                    multiple
                                    value={selectedTagNames}
                                    onChange={this.handleTagsSelectChange}
                                    autoWidth
                                    renderValue={(tagNames) => (
                                        <div style={{display: "flex", flexWrap: "wrap"}}>
                                            {(tagNames as string[]).map((tagName: string) => (
                                                <Chip
                                                    key={tagName} label={tagName}
                                                    onDelete={this.handleChipDelete(tagName)}
                                                    style={{margin: 4}}
                                                />
                                            ))}
                                        </div>
                                    )}
                                >
                                    {tagsWithPrivateKeys.map((tagName) => (
                                        <MenuItem key={tagName} value={tagName}>
                                            {tagName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    Select tags to apply to uploaded replay
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} container alignItems="center">
                            <Grid item xs={12}>
                                <Tooltip title="Add tag using private key">
                                    <IconButton onClick={this.toggleExternalKeyDialog}>
                                        <Add/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography paragraph>
                                {"N.B. Only tags with generated private IDs will appear here. " +
                                "Private IDs can be generated for tags at the "}
                                {<Link to={TAGS_PAGE_LINK}>
                                    tags page
                                </Link>}
                                .
                            </Typography>
                        </Grid>
                    </Grid>
                )}

                <AddTagPrivateKeyDialog
                    open={this.state.addExternalKeyDialogOpen}
                    toggleExternalKeyDialog={this.toggleExternalKeyDialog}
                    addExternalPrivateKey={this.addExternalPrivateKey}
                />
            </>
        )
    }

    private readonly handleChipDelete = (tagName: string) => () => {
        const deletedTagPrivateKey = this.findTagPrivateKeyFromName(tagName)
        const updatedKeys = this.props.selectedPrivateKeys
            .filter((privateKey) => deletedTagPrivateKey !== privateKey)
        this.props.handlePrivateKeysChange(updatedKeys)
    }

    private readonly handleTagsSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const updatedKeys = (event.target.value as unknown as string[])
            .map(this.findTagPrivateKeyFromName)
        this.props.handlePrivateKeysChange(updatedKeys)
    }

    private readonly findTagNameFromPrivateKey = (privateKey: string): string => {
        if (this.props.tags !== null) {
            const foundTag = this.props.tags.find((tag) => tag.privateKey === privateKey)
            return foundTag !== undefined ? foundTag.name : privateKey
        }
        return privateKey
    }
    private readonly findTagPrivateKeyFromName = (name: string): string => {
        if (this.props.tags !== null) {
            const foundPrivateKey = this.props.tags.find((tag) => tag.name === name)
            return foundPrivateKey !== undefined ? foundPrivateKey.privateKey! : name
        }
        return name
    }

    private readonly toggleExternalKeyDialog = () => {
        this.setState({addExternalKeyDialogOpen: !this.state.addExternalKeyDialogOpen})
    }

    private readonly addExternalPrivateKey = (privateKey: string) => {
        this.setState({
            externalPrivateKeys: [...this.state.externalPrivateKeys, privateKey],
            addExternalKeyDialogOpen: false
        })
    }

}

export const UploadTags = connect(mapStateToProps, mapDispatchToProps)(UploadTagsComponent)
