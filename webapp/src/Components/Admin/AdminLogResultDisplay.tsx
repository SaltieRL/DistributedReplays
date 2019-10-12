import { Card, CardHeader, Divider, TablePagination, TextField, withWidth } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import { WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"
import { withNotifications, WithNotifications } from "../Shared/Notification/NotificationUtils"
import { AdminLogDisplayRow } from "./AdminLogDisplayRow"

interface OwnProps {
    adminLogs: AdminLogsResponse
    page: number
    limit: number
    handleChangePage: (event: unknown, page: number) => void
    handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    handleChangeSearch: any
}

type Props = OwnProps
    & WithNotifications
    & WithWidth

interface State {

}

class AdminLogResultDisplayComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        const {adminLogs, page, limit} = this.props
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="Admin Logs" action={
                            <TextField onChange={this.handleSearchChange}/>
                        }/>
                        <div>
                            {this.props.adminLogs.logs.map((log: AdminLog, i) =>
                                <>
                                    <AdminLogDisplayRow
                                        key={log.id}
                                        log={log}/>

                                    {!(i === this.props.adminLogs.logs.length) && <Divider/>}
                                </>
                            )
                            }
                        </div>
                        <TablePagination
                            component="div"
                            count={adminLogs.count}
                            onChangePage={this.props.handleChangePage}
                            onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
                            page={page}
                            rowsPerPage={limit}
                            rowsPerPageOptions={[10, 25, 50]}
                        />
                    </Card>
                    }
                </Grid>
            </Grid>
        )
    }

    private readonly handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        this.props.handleChangeSearch(e.target.value)
    }
}

export const AdminLogResultDisplay = withWidth()(withNotifications()(AdminLogResultDisplayComponent))
