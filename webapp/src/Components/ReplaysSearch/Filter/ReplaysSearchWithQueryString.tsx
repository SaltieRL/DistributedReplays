import * as qs from "qs"
import * as React from "react"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {
    parseReplaySearchFromQueryString,
    ReplaysSearchQueryParams,
    stringifyReplaySearchQueryParam
} from "../../../Models/ReplaysSearchQueryParams"

interface OwnProps {
    handleChange: (queryParams: ReplaysSearchQueryParams) => void
}

type Props = RouteComponentProps<{}>
    & OwnProps

interface State {
    queryParams?: ReplaysSearchQueryParams
}

class ReplaysSearchWithQueryStringComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        this.readQueryString()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (this.state.queryParams && (prevState.queryParams !== this.state.queryParams)) {
            this.setQueryString(this.state.queryParams)
            this.props.handleChange(this.state.queryParams)
        }
        if (prevProps.location.search !== this.props.location.search) {
            this.readQueryString()
        }
    }

    public render() {
        return (
            <>
            </>
        )
    }

    private readonly readQueryString = () => {
        const queryString = this.props.location.search
        if (queryString !== "") {
            const queryParams: ReplaysSearchQueryParams = {
                page: 0,
                limit: 10,
                ...parseReplaySearchFromQueryString(
                    qs.parse(
                        this.props.location.search,
                        {ignoreQueryPrefix: true}
                    )
                )
            }
            this.setState({queryParams})
        }
    }

    private readonly setQueryString = (queryParams: ReplaysSearchQueryParams) => {
        this.props.history.replace({search: stringifyReplaySearchQueryParam(queryParams)})
    }
}

export const ReplaysSearchWithQueryString = withRouter(ReplaysSearchWithQueryStringComponent)
