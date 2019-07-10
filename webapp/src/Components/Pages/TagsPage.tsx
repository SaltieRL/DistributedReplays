import { Grid, List, Paper } from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { StoreState, TagsAction } from "../../Redux"
import { getAllTagsWithPrivateKeys } from "../../Requests/Tag"
import { TagPageListItem } from "../Shared/Tag/TagPageListItem"
import { BasePage } from "./BasePage"

const mapStateToProps = (state: StoreState) => ({
    tags: state.tags
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setTags: (tags: TagWithPrivateKey[]) => dispatch(TagsAction.setTagsAction(tags))
})

type Props = ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>

class TagsPageComponent extends React.PureComponent<Props> {
    public componentDidMount() {
        getAllTagsWithPrivateKeys()
            .then((tags) => this.props.setTags(tags))
    }

    public render() {
        const {tags} = this.props
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12} container justify="center">
                        {tags !== null &&
                        <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                            <Paper>
                                <List>
                                    {tags.map((tag) => (
                                        <TagPageListItem key={tag.name} tag={tag}/>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                        }
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}

export const TagsPage = connect(mapStateToProps, mapDispatchToProps)(TagsPageComponent)
