import { Card, CardHeader, Divider, Grid, IconButton, List, ListItem, Tab, Tabs, Typography } from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import Edit from "@material-ui/icons/Edit"
// import Link from "@material-ui/core/Link"
import { Breadcrumbs } from "@material-ui/lab"
import * as React from "react"
import { Link as DOMLink, RouteComponentProps } from "react-router-dom"
import { PLAYER_PAGE_LINK } from "../../Globals"
import { Entry, GroupPlayerStatsResponse, GroupResponse, GroupTeamStatsResponse } from "../../Models/Replay/Groups"
import { getGroupInfo, getGroupPlayerStats, getGroupTeamStats } from "../../Requests/Replay"
import { ReplayDisplayRow } from "../ReplaysSearch/ReplayDisplayRow"
import { GroupDialog } from "../SavedReplaysGroup/GroupDialog"
import { GroupPlayerStatsTable } from "../SavedReplaysGroup/GroupPlayerStatsTable"
import { GroupTeamStatsTableWrapper } from "../SavedReplaysGroup/GroupTeamStatsTableWrapper"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { WithNotifications, withNotifications } from "../Shared/Notification/NotificationUtils"
import { BasePage } from "./BasePage"

interface RouteParams {
    id: string
}

type GroupTab = "Replays" | "Teams" | "Players"
const groupTabs = ["Replays", "Teams", "Players"]
type Props = RouteComponentProps<RouteParams>
    & WithNotifications

interface State {
    group?: GroupResponse
    playerStats?: GroupPlayerStatsResponse
    teamStats?: GroupTeamStatsResponse
    reloadSignal: boolean
    selectedTab: GroupTab
    dialogOpen: boolean
}

class SavedReplaysGroupPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false, selectedTab: "Replays", dialogOpen: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({reloadSignal: !this.state.reloadSignal})
        }
    }

    public render() {
        const {group, teamStats} = this.state

        const addButton = (
            <IconButton
                onClick={this.toggleDialog}
            >
                <Add/>
            </IconButton>
        )
        const editButton = (
            <IconButton
                onClick={this.toggleDialog}
            >
                <Edit/>
            </IconButton>
        )

        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid container item xs={12} lg={8}>
                        <LoadableWrapper load={this.getGroup} reloadSignal={this.state.reloadSignal}>
                            {group &&
                            <>
                                <Grid container item xs={12}>
                                    <Grid item xs={8}>
                                        <Breadcrumbs aria-label="breadcrumb">
                                            {group.ancestors.map((entry: Entry) => (
                                                <DOMLink to={`/groups/${entry.uuid}`} style={{textDecoration: "none"}}>
                                                    <Typography color="textPrimary">{entry.name}</Typography>
                                                </DOMLink>
                                            ))}
                                            <Typography color="textPrimary">{group.entry.name}</Typography>
                                        </Breadcrumbs>
                                    </Grid>
                                    <Grid container item xs={4}>
                                        <Grid item xs={10}>
                                            <Typography variant={"subtitle1"} noWrap>Created
                                                by <DOMLink style={{textDecoration: "none"}}
                                                            to={PLAYER_PAGE_LINK(group.entry.owner.id)}>
                                                    {group.entry.owner.name}
                                                </DOMLink>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <img src={group.entry.owner.avatarLink} height={"25px"}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader title={group.entry.name} action={<>
                                            {editButton}
                                            {addButton}
                                        </>}/>
                                        <Tabs value={this.state.selectedTab}
                                              onChange={this.handleTabChange}
                                        >
                                            {groupTabs.map((tab) => <Tab label={tab} value={tab}
                                                                         key={tab}/>)}
                                        </Tabs>
                                        <Divider/>
                                        {this.state.selectedTab === "Replays" &&
                                        <List dense>
                                            {group.children.map((child, i) => (
                                                <>
                                                    {child.type ? (
                                                        child.gameObject &&
                                                        <ReplayDisplayRow replay={child.gameObject}
                                                                          handleUpdateTags={(tag: Tag[]) => {
                                                                          }}/>
                                                    ) : (
                                                        <ListItem>
                                                            <DOMLink color="inherit" to={`/groups/${child.uuid}`}
                                                                     style={{textDecoration: "none"}}>
                                                                <Typography variant="subtitle1"
                                                                            color="textPrimary">
                                                                    {child.name}
                                                                </Typography>
                                                            </DOMLink>
                                                        </ListItem>
                                                    )}
                                                    {i !== group.children.length - 1 && <Divider/>}
                                                </>
                                            ))}
                                        </List>}
                                        {this.state.selectedTab === "Players" &&
                                        <LoadableWrapper load={this.getStatsPlayers}>
                                            {this.state.playerStats && <GroupPlayerStatsTable
                                                style={{overflowX: "scroll"}}
                                                stats={this.state.playerStats}/>}
                                        </LoadableWrapper>}
                                        {this.state.selectedTab === "Teams" &&
                                        <LoadableWrapper load={this.getStatsTeams}>
                                            {teamStats && teamStats.teamStats &&
                                            <GroupTeamStatsTableWrapper stats={teamStats}/>}
                                        </LoadableWrapper>}
                                    </Card>
                                </Grid>
                            </>
                            }
                        </LoadableWrapper>
                    </Grid>
                </Grid>
                <GroupDialog group={this.props.match.params.id} openDialog={this.state.dialogOpen}
                             onCloseDialog={this.toggleDialog}/>
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

    private readonly handleTabChange = (_: React.ChangeEvent<{}>, selectedTab: GroupTab) => {
        this.setState({selectedTab})
    }
    private readonly toggleDialog = () => {
        this.setState({dialogOpen: !this.state.dialogOpen})
    }
}

export const SavedReplaysGroupPage = withNotifications()(SavedReplaysGroupPageComponent)
