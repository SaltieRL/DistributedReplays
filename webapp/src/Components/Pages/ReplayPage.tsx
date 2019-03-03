import { Grid } from "@material-ui/core"
import * as React from "react"
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom"
import { Replay } from "../../Models"
import { getExplanations, getPredictedRanks, getReplay } from "../../Requests/Replay"
import { ReplayView } from "../Replay/ReplayView"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

interface RouteParams {
    id: string
}

type Props = RouteComponentProps<RouteParams>

interface State {
    replay?: Replay
    explanations?: Record<string, any> | undefined
    predictedRanks?: Predictions
}

export class ReplayPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        this.getPredictedRanks()
    }

    public render() {
        const matchUrl = this.props.match.url
        const { replay, explanations, predictedRanks } = this.state

        return (
            <BasePage backgroundImage={"/replay_page_background.png"}>
                <Grid container spacing={24} justify="center" style={{ minHeight: "100%" }}>
                    <LoadableWrapper load={this.getBoth}>
                        {replay && (
                            <Switch>
                                <Route
                                    exact
                                    path={matchUrl}
                                    render={() => (
                                        <ReplayView
                                            replay={replay}
                                            predictedRanks={predictedRanks}
                                            explanations={explanations}
                                            handleUpdateTags={this.handleUpdateTags}
                                        />
                                    )}
                                />
                                <Redirect from="*" to={matchUrl} />
                            </Switch>
                        )}
                    </LoadableWrapper>
                </Grid>
            </BasePage>
        )
    }

    private readonly getBoth = async() => {
        return Promise.all([getReplay(this.props.match.params.id), getExplanations()]).then(
            (data) => this.setState({ replay: data[0], explanations: data[1] })
        )
    }

    private readonly getPredictedRanks = async() => {
        return getPredictedRanks(this.props.match.params.id).then((predictedRanks) =>
            this.setState({ predictedRanks })
        )
    }

    private readonly handleUpdateTags = (tags: Tag[]) => {
        const replay = {
            ...this.state.replay!,
            tags
        }
        this.setState({ replay })
    }
}
