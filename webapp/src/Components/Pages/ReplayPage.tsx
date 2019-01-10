import { Grid } from "@material-ui/core"
import * as React from "react"
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom"
import { Replay } from "src/Models"
import { getPredictedRanks, getExplanations, getReplay } from "../../Requests/Replay"
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
    predictedRanks?: any
}

export class ReplayPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        const matchUrl = this.props.match.url
        const {replay, explanations, predictedRanks} = this.state

        return (
            <BasePage backgroundImage={"/replay_page_background.png"}>
                <Grid container spacing={24} justify="center" style={{minHeight: "100%"}}>
                    <LoadableWrapper load={this.getBoth}>
                        {replay &&
                        <Switch>
                            <Route
                                exact path={matchUrl}
                                render={() => (
                                    <ReplayView
                                        replay={replay}
                                        predictedRanks={predictedRanks}
                                        explanations={explanations}
                                        handleUpdateTags={this.handleUpdateTags}
                                    />
                                )}
                            />
                            <Redirect from="*" to={matchUrl}/>
                        </Switch>
                        }
                    </LoadableWrapper>
                </Grid>
            </BasePage>
        )
    }

    // private readonly getReplay = (): Promise<void> => {
    //     return Promise.all([getReplay(this.props.match.params.id), getExplanations()])
    //         .then((replay) => this.setState({replay: replay[0], explanations: replay[1]}))
    // }

    private readonly getBoth = (): Promise<void> => {
        // TODO: when predictions 404, don't show the tab (?)
        return Promise.all([getReplay(this.props.match.params.id), getPredictedRanks(this.props.match.params.id)])
            .then((data) => this.setState({replay: data[0], predictedRanks: data[1]}))
    }
    // private getPredictedRanks = (): Promise<void> => {
    //     return getPredictedRanks(this.props.match.params.id)
    //         .then((predictedRanks) => this.setState({predictedRanks}))
    // }

    private readonly handleUpdateTags = (tags: Tag[]) => {
        const replay = {
            ...this.state.replay!,
            tags
        }
        this.setState({replay})
    }
}
