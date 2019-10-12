import { Grid } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { connect } from "react-redux"
import { StoreState } from "../../Redux"
import { getAdminLogs } from "../../Requests/Global"
import { AdminLogResultDisplay } from "../Admin/AdminLogResultDisplay"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

interface State {
    adminLogs?: AdminLogsResponse
    timerID?: number
    reloadSignal: boolean
    page: number
    limit: number
    search: string
}

type Props = ReturnType<typeof mapStateToProps>

class AdminPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false, page: 0, limit: 10, search: ""}
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    {(this.props.loggedInUser && this.props.loggedInUser.beta) ?
                        <LoadableWrapper load={this.getAdminLogs} reloadSignal={this.state.reloadSignal}>
                            {this.state.adminLogs &&
                            <Grid item xs={12} md={8}>
                                <AdminLogResultDisplay adminLogs={this.state.adminLogs} page={this.state.page}
                                                       limit={this.state.limit}
                                                       handleChangePage={this.handleChangePage}
                                                       handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                       handleChangeSearch={this.handleChangeSearch}
                                />
                            </Grid>
                            }

                        </LoadableWrapper>
                        :
                        <Typography>In beta, Patrons only.</Typography>
                    }
                </Grid>
            </BasePage>
        )
    }

    private readonly getAdminLogs = (): Promise<void> => {
        return getAdminLogs(this.state.page, this.state.limit, this.state.search)
            .then((packs: AdminLogsResponse) => this.setState({adminLogs: packs}))
    }

    private readonly handleChangePage = (event: unknown, page: number) => {
        this.setState({page}, () => {
            this.getAdminLogs()
        })
    }

    private readonly handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> =
        (event) => {
            this.setState({limit: Number(event.target.value)}, () => {
                this.getAdminLogs()
            })
        }
    private readonly handleChangeSearch = (search: string) => {
        this.setState({search}, () => {
            this.getAdminLogs()
        })
    }
}

export const AdminPage = connect(mapStateToProps)(AdminPageComponent)
