import {Grid} from "@material-ui/core"
// import Link from "@material-ui/core/Link"
import * as React from "react"
import {connect} from "react-redux"
import {GroupResponse} from "../../Models/Replay/Groups"
import {StoreState} from "../../Redux"
import {getMyGroups} from "../../Requests/Replay"
import {LoadableWrapper} from "../Shared/LoadableWrapper"
import {withNotifications} from "../Shared/Notification/NotificationUtils"
import {BasePage} from "./BasePage"

interface State {
    groups?: GroupResponse
}

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

class SavedReplaysGroupPageComponent extends React.PureComponent<{}, State> {
    public render() {
        return (
            <BasePage>
                <Grid container spacing={1} justify="center">
                    <Grid container item xs={12} lg={8}>
                        <LoadableWrapper load={this.getGroups}></LoadableWrapper>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly getGroups = (): Promise<void> => {
        return getMyGroups().then((response) => {
            this.setState({groups: response})
        })
    }
}

export const SavedReplaysGroupPage = withNotifications()(connect(mapStateToProps)(SavedReplaysGroupPageComponent))
