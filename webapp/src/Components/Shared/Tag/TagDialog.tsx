import { Dialog, DialogContent, DialogTitle, Divider, Tab, Tabs } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models/Replay/Replay"
import { deleteTag, getAllTags } from "../../../Requests/Tag"
import { LoadableWrapper } from "../LoadableWrapper"
import { ReplayTagDisplay } from "./ReplayTagDisplay"
import { UserTagDisplay } from "./UserTagDisplay"

type TagTab = "Replay" | "My tags"
const tagTabs: TagTab[] = ["Replay", "My tags"]

interface Props {
    open: boolean,
    onClose: React.ReactEventHandler<{}>
    replay: Replay
    handleUpdateTags: (tags: Tag[]) => void
}

interface State {
    selectedTab: TagTab
    userTags?: Tag[]
}

export class TagDialog extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {selectedTab: "Replay"}
    }

    public render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                scroll="paper"
                PaperProps={{style: {width: 360, maxWidth: "90vw"}}}
            >
                <DialogTitle style={{padding: 0}}>
                    <Tabs
                        value={this.state.selectedTab}
                        onChange={this.handleTabChange}
                        centered
                    >
                        {tagTabs.map((tagTab) =>
                            <Tab label={tagTab} value={tagTab} key={tagTab}/>
                        )}
                    </Tabs>
                    <Divider/>
                </DialogTitle>
                <DialogContent>
                    <LoadableWrapper load={this.loadUserTags}>
                        {this.state.userTags &&
                        (this.state.selectedTab === "Replay" ?
                                <ReplayTagDisplay
                                    replay={this.props.replay}
                                    userTags={this.state.userTags}
                                    handleUpdateTags={this.props.handleUpdateTags}
                                />
                                :
                                <UserTagDisplay
                                    tags={this.state.userTags}
                                    handleCreate={this.handleCreateUserTag}
                                    deleteTag={this.deleteTag}
                                />
                        )
                        }
                    </LoadableWrapper>
                </DialogContent>
            </Dialog>
        )
    }

    private readonly handleTabChange = (_: React.ChangeEvent<{}>, selectedTab: TagTab) => {
        this.setState({selectedTab})
    }

    private readonly loadUserTags = (): Promise<void> => {
        return getAllTags()
            .then((userTags) => this.setState({userTags}))
    }

    private readonly handleCreateUserTag = (tag: Tag) => {
        if (this.state.userTags) {
            const tagNameAlreadyExists = this.state.userTags.map((testTag) => testTag.name)
                .indexOf(tag.name) !== -1
            if (tagNameAlreadyExists) {
                return
            }
        }

        this.setState({
            userTags: [...this.state.userTags || [], tag]
        })
    }

    private readonly deleteTag = (tag: Tag) => () => {
        if (this.state.userTags !== undefined) {
            deleteTag(tag.name)
                .then(() => {
                    this.setState({
                        userTags: this.state.userTags!.filter((testTag) => !(testTag.name === tag.name))
                    })
                })
        }
    }
}
