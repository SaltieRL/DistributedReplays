import {Card, CardHeader, Divider, Grid, IconButton, List} from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import Check from "@material-ui/icons/Check"
import Delete from "@material-ui/icons/Delete"
import Edit from "@material-ui/icons/Edit"
import * as _ from "lodash"
// import Link from "@material-ui/core/Link"
import * as React from "react"
import {connect} from "react-redux"
import {GroupResponse} from "../../Models/Replay/Groups"
import {StoreState} from "../../Redux"
import {deleteGames, getMyGroups} from "../../Requests/Replay"
import {GroupSubGroupAddDialog} from "../ReplaysSavedGroup/GroupSubGroupAddDialog"
import {SubgroupEntry} from "../ReplaysSavedGroup/SubgroupEntry"
import {ReplayDisplayRow} from "../ReplaysSearch/ReplayDisplayRow"
import {LoadableWrapper} from "../Shared/LoadableWrapper"
import {withNotifications} from "../Shared/Notification/NotificationUtils"
import {BasePage} from "./BasePage"

interface State {
    group?: GroupResponse
    reloadSignal: boolean
    addDialogOpen: boolean
    editActive: boolean
    selectedEntries: string[]
}

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

class SavedReplaysMyGroupsPageComponent extends React.PureComponent<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {
            reloadSignal: false,
            addDialogOpen: false,
            editActive: false,
            selectedEntries: []
        }
    }

    public render() {
        const {group} = this.state

        const addButton = (
            <IconButton onClick={this.toggleAddDialog}>
                <Add />
            </IconButton>
        )
        const editButton = (
            <IconButton onClick={this.toggleEdit}>{this.state.editActive ? <Check /> : <Edit />}</IconButton>
        )
        const deleteButton = this.state.editActive ? (
            <IconButton onClick={this.deleteEntries}>
                <Delete />
            </IconButton>
        ) : null

        return (
            <BasePage>
                <Grid container spacing={1} justify="center">
                    <Grid container item xs={12} lg={8}>
                        <LoadableWrapper load={this.getGroups} reloadSignal={this.state.reloadSignal}>
                            {group && (
                                <>
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardHeader
                                                title={"My groups"}
                                                action={
                                                    <>
                                                        {deleteButton}
                                                        {editButton}
                                                        {addButton}
                                                    </>
                                                }
                                            />

                                            <List dense>
                                                {group.children.map((child, i) => (
                                                    <>
                                                        {child.type ? (
                                                            child.gameObject && (
                                                                <ReplayDisplayRow
                                                                    selectProps={
                                                                        this.state.editActive
                                                                            ? {
                                                                                  selected: _.includes(
                                                                                      this.state.selectedEntries,
                                                                                      child.uuid
                                                                                  ),
                                                                                  handleSelectChange: this.handleSelectChange(
                                                                                      child.uuid
                                                                                  )
                                                                              }
                                                                            : undefined
                                                                    }
                                                                    replay={child.gameObject}
                                                                    handleUpdateTags={(tag: Tag[]) => {}}
                                                                />
                                                            )
                                                        ) : (
                                                            <SubgroupEntry
                                                                selectProps={
                                                                    this.state.editActive
                                                                        ? {
                                                                              selected: _.includes(
                                                                                  this.state.selectedEntries,
                                                                                  child.uuid
                                                                              ),
                                                                              handleSelectChange: this.handleSelectChange(
                                                                                  child.uuid
                                                                              )
                                                                          }
                                                                        : undefined
                                                                }
                                                                entry={child}
                                                            />
                                                        )}
                                                        {i !== group.children.length - 1 && <Divider />}
                                                    </>
                                                ))}
                                            </List>
                                        </Card>
                                    </Grid>
                                </>
                            )}
                        </LoadableWrapper>
                    </Grid>
                </Grid>
                <GroupSubGroupAddDialog openDialog={this.state.addDialogOpen} onCloseDialog={this.closeDialog} />
            </BasePage>
        )
    }

    private readonly getGroups = (): Promise<void> => {
        return getMyGroups().then((response) => {
            this.setState({group: response})
        })
    }
    private readonly toggleAddDialog = () => {
        this.setState({addDialogOpen: !this.state.addDialogOpen})
    }
    private readonly closeDialog = () => {
        this.setState({addDialogOpen: !this.state.addDialogOpen, reloadSignal: !this.state.reloadSignal})
    }
    private readonly toggleEdit = () => {
        this.setState({editActive: !this.state.editActive})
    }

    private readonly deleteEntries = () => {
        deleteGames(this.state.selectedEntries).then(() => {
            this.setState({
                editActive: !this.state.editActive,
                selectedEntries: [],
                reloadSignal: !this.state.reloadSignal
            })
        })
    }

    private readonly handleSelectChange = (id: string) => (checked: boolean) => {
        if (!checked) {
            this.setState({
                selectedEntries: this.state.selectedEntries.filter((replayId) => replayId !== id)
            })
        } else {
            this.setState({
                selectedEntries: [...this.state.selectedEntries, id]
            })
        }
    }
}

export const SavedReplaysMyGroupsPage = withNotifications()(connect(mapStateToProps)(SavedReplaysMyGroupsPageComponent))
