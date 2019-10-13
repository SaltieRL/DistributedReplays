import * as React from "react"

import { Button, Card, CardContent, createStyles, Grid, Typography, WithStyles, withStyles } from "@material-ui/core"
import { connect } from "react-redux"
import { doGet } from "../../../../apiHandler/apiHandler"
import { StoreState } from "../../../../Redux"
import { withNotifications, WithNotifications } from "../../../Shared/Notification/NotificationUtils"
import { GroupIndicator } from "../GroupIndicator"
import { PlayerNameDropdown } from "./PlayerNameDropdown"
import { PlayerProfilePicture } from "./PlayerProfilePicture"

const styles = createStyles({
    card: {
        display: "flex",
        minHeight: 128
    },
    avatar: {
        flex: "0 0 128px"
    },
    content: {
        width: "calc(100% - 128px)"
    },
    nameWrapper: {
        whiteSpace: "nowrap",
        display: "flex"
    }
})

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>
    & ReturnType<typeof mapStateToProps>
    & WithNotifications

class PlayerProfileComponent extends React.PureComponent<Props> {
    public render() {
        const {player, classes} = this.props
        return (
            <Card className={classes.card}>
                <PlayerProfilePicture image={player.avatarLink}/>
                <CardContent className={classes.content}>
                    <Grid container alignContent="space-around" style={{height: "100%"}}>
                        <Grid item xs={12}>
                            <div className={classes.nameWrapper}>
                                <Typography variant="h5" noWrap>
                                    {player.name}
                                </Typography>
                                {player.pastNames.length > 0 && <PlayerNameDropdown pastNames={player.pastNames}/>}
                                <GroupIndicator groups={player.groups} variant={"subtitle1"}/>
                            </div>
                        </Grid>
                        <Grid item xs={12} container justify="flex-end">
                            <a
                                href={player.profileLink}
                                target="_blank"
                                rel="noreferrer noopener"
                                style={{textDecoration: "none"}}
                            >
                                <Button variant="text" size="small">
                                    <Typography variant="subtitle1">
                                        {player.platform}
                                    </Typography>
                                </Button>
                            </a>
                        </Grid>
                        {this.props.loggedInUser && this.props.loggedInUser.admin &&
                        <>
                            <Grid item xs={12} container justify="flex-end">
                                {[4, 2, 3].map((num) => {
                                    return <>
                                        {player.groups.indexOf(num) === -1 ?
                                            <Button variant="text" size="small" onClick={() => {
                                                this.addGroupToUser(player.id, num)
                                            }}
                                                    style={{textTransform: "none"}}
                                            >
                                                <GroupIndicator groups={[num]} faded={true}/>
                                            </Button> :
                                            <Button variant="text" size="small" onClick={() => {
                                                this.removeGroupFromUser(player.id, num)
                                            }}
                                                    style={{textTransform: "none"}}
                                            >
                                                <GroupIndicator groups={[num]}/>
                                            </Button>
                                        }
                                    </>
                                })}

                            </Grid>
                        </>
                        }
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    private readonly addGroupToUser = (id: string, group: number) => {
        doGet(`/admin/group/add/${id}/${group}`).then(() => {
            this.props.showNotification({
                variant: "success",
                message: "Successfully added group to user",
                timeout: 3000
            })
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        }).catch((err) => {
            this.props.showNotification({
                variant: "error",
                message: "Error",
                timeout: 10000
            })
        })
    }
    private readonly removeGroupFromUser = (id: string, group: number) => {
        doGet(`/admin/group/remove/${id}/${group}`).then(() => {
            this.props.showNotification({
                variant: "success",
                message: "Successfully removed group from user",
                timeout: 3000
            })
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        }).catch((err) => {
            this.props.showNotification({
                variant: "error",
                message: "Error",
                timeout: 10000
            })
        })
    }

}

export const PlayerProfile = withNotifications()(
    connect(mapStateToProps)(withStyles(styles)(PlayerProfileComponent)))
