import { Button, Grid, TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { connect } from "react-redux"
import { doGet } from "../../apiHandler/apiHandler"
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
    key: string
}

type Props = ReturnType<typeof mapStateToProps>

class AdminPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false, page: 0, limit: 10, search: "", key: ""}
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    {(this.props.loggedInUser && this.props.loggedInUser.beta) ?
                        <>
                            <Grid item xs={12}>
                                <LoadableWrapper load={this.getAdminLogs} reloadSignal={this.state.reloadSignal}>
                                    {this.state.adminLogs &&
                                    <AdminLogResultDisplay adminLogs={this.state.adminLogs} page={this.state.page}
                                                           limit={this.state.limit}
                                                           handleChangePage={this.handleChangePage}
                                                           handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                           handleChangeSearch={this.handleChangeSearch}
                                    />
                                    }
                                </LoadableWrapper>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField onChange={this.handleKeyChange}/>
                                <Button variant="outlined" onClick={this.updateServer}>Update server</Button>
                            </Grid>
                        </>
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

    private readonly handleKeyChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        this.setState({key: e.target.value})
    }
    private readonly updateServer = () => {
        doGet("/internal/update?update_code=" + this.state.key)
    }
}

export const AdminPage = connect(mapStateToProps)(AdminPageComponent)
