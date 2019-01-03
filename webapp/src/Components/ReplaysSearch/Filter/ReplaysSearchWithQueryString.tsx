import * as qs from "qs"
import * as React from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import {
    parseReplaySearchFromQueryString,
    ReplaysSearchQueryParams,
    stringifyReplaySearchQueryParam
} from "../../../Models"
import { ReplaysSearchFilter } from "./ReplaysSearchFilter"

interface OwnProps {
    handleChange: (queryParams: ReplaysSearchQueryParams) => void
}

type Props = RouteComponentProps<{}>
    & OwnProps

interface State {
    queryParams: ReplaysSearchQueryParams
}

class ReplaysSearchWithQueryStringComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {queryParams: {page: 0, limit: 10, ...this.readQueryString()}}
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.state.queryParams && (prevState.queryParams !== this.state.queryParams)) {
            this.setQueryString(this.state.queryParams)
            this.props.handleChange(this.state.queryParams)
        }
        if (prevProps.location.search !== this.props.location.search) {
            const queryParams = {
                ...this.state.queryParams,
                ...this.readQueryString()
            }
            this.setState({queryParams})
        }
    }

    public render() {
        return (
            <ReplaysSearchFilter queryParams={this.state.queryParams} handleChange={this.setQueryParams}/>
        )
    }

    private readonly readQueryString = (): Partial<ReplaysSearchQueryParams> => {
        const queryString = this.props.location.search
        if (queryString !== "") {
            return {
                ...parseReplaySearchFromQueryString(
                    qs.parse(
                        this.props.location.search,
                        {ignoreQueryPrefix: true}
                    )
                )
            }
        }
        return {}
    }

    private readonly setQueryString = (queryParams: ReplaysSearchQueryParams) => {
        this.props.history.replace({search: stringifyReplaySearchQueryParam(queryParams)})
    }

    private readonly setQueryParams = (queryParams: ReplaysSearchQueryParams) => {
        this.setState({queryParams})
    }
}

export const ReplaysSearchWithQueryString = withRouter(ReplaysSearchWithQueryStringComponent)
