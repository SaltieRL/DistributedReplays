import {
    Breadcrumbs,
    Card,
    CardHeader,
    ClickAwayListener,
    Divider,
    Grid,
    Grow,
    IconButton,
    List,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Tab,
    Tabs,
    Tooltip,
    Typography
} from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import Check from "@material-ui/icons/Check"
import Delete from "@material-ui/icons/Delete"
import Edit from "@material-ui/icons/Edit"
import FormatItalic from "@material-ui/icons/FormatItalic"
import * as _ from "lodash"
import * as React from "react"
import {connect} from "react-redux"
import {Link as DOMLink, RouteComponentProps} from "react-router-dom"

import {PLAYER_PAGE_LINK} from "../../Globals"
import {Entry, GroupPlayerStatsResponse, GroupResponse, GroupTeamStatsResponse} from "../../Models/Replay/Groups"
import {StoreState} from "../../Redux"
import {deleteGames, getGroupInfo, getGroupPlayerStats, getGroupTeamStats} from "../../Requests/Replay"
import {GroupAddDialog} from "../ReplaysSavedGroup/GroupAddDialog"
import {GroupPlayerStatsTableWrapper} from "../ReplaysSavedGroup/GroupPlayerStatsTableWrapper"
import {GroupRenameDialog} from "../ReplaysSavedGroup/GroupRenameDialog"
import {GroupSubGroupAddDialog} from "../ReplaysSavedGroup/GroupSubGroupAddDialog"
import {GroupTeamStatsTableWrapper} from "../ReplaysSavedGroup/GroupTeamStatsTableWrapper"
import {SubgroupEntry} from "../ReplaysSavedGroup/SubgroupEntry"
import {ReplayDisplayRow} from "../ReplaysSearch/ReplayDisplayRow"
import {LoadableWrapper} from "../Shared/LoadableWrapper"
import {WithNotifications, withNotifications} from "../Shared/Notification/NotificationUtils"
import {BasePage} from "./BasePage"

interface RouteParams {
    id: string
}

type GroupTab = "Replays" | "Teams" | "Players"
const groupTabs = ["Replays", "Teams", "Players"]
type Props = RouteComponentProps<RouteParams> & WithNotifications & ReturnType<typeof mapStateToProps>

interface State {
    group?: GroupResponse
    playerStats?: GroupPlayerStatsResponse
    teamStats?: GroupTeamStatsResponse
    reloadSignal: boolean
    selectedTab: GroupTab
    addDialogOpen: boolean
    addSubDialogOpen: boolean
    popperOpen: boolean
    popperRef: HTMLButtonElement | null
    editActive: boolean
    renameActive: boolean
    selectedEntries: string[]
}

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

class SavedReplaysGroupPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            reloadSignal: false,
            selectedTab: "Replays",
            addDialogOpen: false,
            addSubDialogOpen: false,
            popperOpen: false,
            popperRef: null,
            editActive: false,
            renameActive: false,
            selectedEntries: []
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({reloadSignal: !this.state.reloadSignal})
        }
    }

    public render() {
        const {group, teamStats, popperRef} = this.state

        const addButton = (
            <Tooltip title={"Add replays/subgroup"}>
                <IconButton
                    ref={(val) => {
                        this.setState({popperRef: val})
                    }}
                    onClick={() => {
                        this.setState({popperOpen: !this.state.popperOpen})
                    }}
                >
                    <Add />
                </IconButton>
            </Tooltip>
        )
        const options = ["Replay", "Subgroup"]
        const listeners = [this.toggleAddDialog, this.toggleAddSubDialog]
        const dropdownButton = popperRef && (
            <Popper open={this.state.popperOpen} anchorEl={popperRef} role={undefined} transition disablePortal>
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom"
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={this.togglePopper}>
                                <MenuList id="split-button-menu">
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            disabled={index === 2}
                                            onClick={() => {
                                                this.togglePopper()
                                                listeners[index]()
                                            }}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        )
        const editButton = (
            <Tooltip title={"Edit contents"}>
                <IconButton onClick={this.toggleEdit}>{this.state.editActive ? <Check /> : <Edit />}</IconButton>
            </Tooltip>
        )
        const renameButton = (
            <Tooltip title={"Rename"}>
                <IconButton onClick={this.toggleRename}>
                    <FormatItalic />
                </IconButton>
            </Tooltip>
        )
        const deleteButton = this.state.editActive ? (
            <Tooltip title={"Delete selected"}>
                <IconButton onClick={this.deleteEntries}>
                    <Delete />
                </IconButton>
            </Tooltip>
        ) : null

        return (
            <BasePage>
                <Grid container spacing={1} justify="center">
                    <Grid container item xs={12} lg={8}>
                        <LoadableWrapper load={this.getGroup} reloadSignal={this.state.reloadSignal}>
                            {group && (
                                <>
                                    <Grid container item xs={12}>
                                        <Grid item xs={9}>
                                            <Breadcrumbs aria-label="breadcrumb">
                                                {group.ancestors.map((entry: Entry) => (
                                                    <DOMLink
                                                        key={entry.uuid}
                                                        to={`/groups/${entry.uuid}`}
                                                        style={{textDecoration: "none"}}
                                                    >
                                                        <Typography color="textPrimary">{entry.name}</Typography>
                                                    </DOMLink>
                                                ))}
                                                <Typography color="textPrimary">{group.entry.name}</Typography>
                                            </Breadcrumbs>
                                        </Grid>
                                        <Grid container item xs={3}>
                                            <Typography variant={"subtitle1"} noWrap>
                                                <DOMLink
                                                    style={{textDecoration: "none"}}
                                                    to={PLAYER_PAGE_LINK(group.entry.owner.id)}
                                                >
                                                    Created by{" "}
                                                    <img
                                                        src={group.entry.owner.avatarLink}
                                                        height={"15px"}
                                                        alt="profile avatar"
                                                    />{" "}
                                                    {group.entry.owner.name}
                                                </DOMLink>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardHeader
                                                title={group.entry.name}
                                                action={
                                                    this.props.loggedInUser &&
                                                    group.entry.owner.id === this.props.loggedInUser.id ? (
                                                        <>
                                                            {renameButton}
                                                            {deleteButton}
                                                            {editButton}
                                                            {addButton}
                                                        </>
                                                    ) : null
                                                }
                                            />
                                            <Tabs value={this.state.selectedTab} onChange={this.handleTabChange}>
                                                {groupTabs.map((tab) => (
                                                    <Tab label={tab} value={tab} key={tab} />
                                                ))}
                                            </Tabs>
                                            <Divider />
                                            {this.state.selectedTab === "Replays" && (
                                                <List dense>
                                                    {group.children.map((child, i) => (
                                                        <div key={i}>
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
                                                                        handleUpdateTags={(tag: Tag[]) => null}
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
                                                        </div>
                                                    ))}
                                                </List>
                                            )}
                                            {this.state.selectedTab === "Players" && (
                                                <LoadableWrapper load={this.getStatsPlayers}>
                                                    {this.state.playerStats && (
                                                        <GroupPlayerStatsTableWrapper stats={this.state.playerStats} />
                                                    )}
                                                </LoadableWrapper>
                                            )}
                                            {this.state.selectedTab === "Teams" && (
                                                <LoadableWrapper load={this.getStatsTeams}>
                                                    {teamStats && teamStats.teamStats && (
                                                        <GroupTeamStatsTableWrapper stats={teamStats} />
                                                    )}
                                                </LoadableWrapper>
                                            )}
                                        </Card>
                                    </Grid>
                                </>
                            )}
                        </LoadableWrapper>
                    </Grid>
                </Grid>
                <GroupAddDialog
                    group={this.props.match.params.id}
                    openDialog={this.state.addDialogOpen}
                    onCloseDialog={this.closeDialog}
                />
                {this.state.group && (
                    <GroupRenameDialog
                        group={this.props.match.params.id}
                        name={this.state.group.entry.name}
                        openDialog={this.state.renameActive}
                        onCloseDialog={this.toggleRename}
                    />
                )}
                <GroupSubGroupAddDialog
                    group={this.props.match.params.id}
                    openDialog={this.state.addSubDialogOpen}
                    onCloseDialog={this.closeSubDialog}
                />
                {dropdownButton}
            </BasePage>
        )
    }

    private readonly getGroup = (): Promise<void> => {
        return getGroupInfo(this.props.match.params.id).then((response) => {
            this.setState({group: response})
        })
    }
    private readonly getStatsPlayers = (): Promise<void> => {
        return getGroupPlayerStats(this.props.match.params.id).then((response) => {
            this.setState({playerStats: response})
        })
    }
    private readonly getStatsTeams = (): Promise<void> => {
        return getGroupTeamStats(this.props.match.params.id).then((response) => {
            this.setState({teamStats: response})
        })
    }

    private readonly handleTabChange = (__: React.ChangeEvent<{}>, selectedTab: GroupTab) => {
        this.setState({selectedTab})
    }
    private readonly toggleAddDialog = () => {
        this.setState({addDialogOpen: !this.state.addDialogOpen})
    }
    private readonly toggleAddSubDialog = () => {
        this.setState({addSubDialogOpen: !this.state.addSubDialogOpen})
    }
    private readonly togglePopper = () => {
        this.setState({popperOpen: !this.state.popperOpen})
    }
    private readonly closeDialog = () => {
        this.setState({addDialogOpen: !this.state.addDialogOpen, reloadSignal: !this.state.reloadSignal})
    }
    private readonly closeSubDialog = () => {
        this.setState({addSubDialogOpen: !this.state.addSubDialogOpen, reloadSignal: !this.state.reloadSignal})
    }
    private readonly toggleEdit = () => {
        this.setState({editActive: !this.state.editActive})
    }
    private readonly toggleRename = () => {
        if (this.state.renameActive) {
            this.toggleReload()
        }
        this.setState({renameActive: !this.state.renameActive})
    }
    private readonly toggleReload = () => {
        setTimeout(() => {
            this.setState({reloadSignal: !this.state.reloadSignal})
        }, 1000)
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

export const SavedReplaysGroupPage = withNotifications()(connect(mapStateToProps)(SavedReplaysGroupPageComponent))
