import { TablePagination } from "@material-ui/core"
import * as qs from "qs"
import * as React from "react"
import { RouteComponentProps, withRouter } from "react-router"

interface OwnProps {
    totalCount: number
    page: number
    limit: number
}

type Props = OwnProps
    & RouteComponentProps<{}>

class TrainingPackTablePaginationComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <TablePagination
                component="div"
                count={this.props.totalCount}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                page={this.props.page}
                rowsPerPage={this.props.limit}
                rowsPerPageOptions={[10, 25, 50]}
            />
        )
    }

    private readonly handleChangePage = (event: unknown, page: number) => {
        const currentQueryParams = qs.parse(
            this.props.location.search,
            {ignoreQueryPrefix: true}
        )
        this.props.history.replace({
            search: qs.stringify({
                ...currentQueryParams,
                page
            })
        })
    }

    private readonly handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> =
        (event) => {
            const currentQueryParams = qs.parse(
                this.props.location.search,
                {ignoreQueryPrefix: true}
            )
            this.props.history.replace({
                search: qs.stringify({
                    ...currentQueryParams,
                    page: 0,
                    limit: Number(event.target.value)
                })
            })
        }
}

export const TrainingPackTablePagination = withRouter(TrainingPackTablePaginationComponent)
