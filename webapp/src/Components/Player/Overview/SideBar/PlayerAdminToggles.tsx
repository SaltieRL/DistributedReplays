import { Button } from "@material-ui/core"
import * as React from "react"
import { doGet } from "../../../../apiHandler/apiHandler"
import { WithNotifications, withNotifications } from "../../../Shared/Notification/NotificationUtils"
import { GroupIndicator } from "./GroupIndicator"

interface OwnProps {
    player: Player
}

type Props = OwnProps & WithNotifications

class PlayerAdminTogglesComponent extends React.PureComponent<Props> {
    public render() {
        const {player} = this.props
        return (
            <>
                {[4, 2, 3].map((groupNum) => {
                    const playerInGroup = player.groups.indexOf(groupNum) !== -1
                    return (
                        <Button
                            key={groupNum}
                            variant="text"
                            size="small"
                            onClick={
                                playerInGroup ?
                                    () => this.removeGroupFromUser(player.id, groupNum) :
                                    () => this.addGroupToUser(player.id, groupNum)
                            }
                            style={{textTransform: "none"}}
                        >
                            <GroupIndicator groups={[groupNum]} faded={!playerInGroup}/>
                        </Button>
                    )
                })}
            </>
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

export const PlayerAdminToggles = withNotifications()(PlayerAdminTogglesComponent)
