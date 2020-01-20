import {Grid, withTheme, WithTheme} from "@material-ui/core"
import * as React from "react"
import {Redirect, Route, RouteComponentProps, Switch} from "react-router-dom"
import {Replay} from "../../Models"
import {getExplanations, getReplay} from "../../Requests/Replay"
import {ReplayView} from "../Replay/ReplayView"
import {LoadableWrapper} from "../Shared/LoadableWrapper"
import {BasePage} from "./BasePage"

interface RouteParams {
    id: string
}

type Props = RouteComponentProps<RouteParams> & WithTheme

interface State {
    replay?: Replay
    explanations?: Record<string, any> | undefined
    predictedRanks?: any
}

class ReplayPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        const matchUrl = this.props.match.url
        const {replay, explanations} = this.state

        const backgroundImage =
            this.props.theme.palette.type === "dark"
                ? "/replay_page_background_black.jpg"
                : "/replay_page_background.jpg"
        return (
            <BasePage backgroundImage={backgroundImage}>
                <Grid container spacing={3} justify="center" style={{minHeight: "100%"}}>
                    <LoadableWrapper load={this.getReplay}>
                        {replay && (
                            <Switch>
                                <Route
                                    exact
                                    path={matchUrl}
                                    render={() => (
                                        <ReplayView
                                            replay={replay}
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

    private readonly getReplay = (): Promise<void> => {
        return Promise.all([getReplay(this.props.match.params.id), getExplanations()])
            .then((replay) => this.setState({replay: replay[0], explanations: replay[1]}))
            .catch((response) => {
                if (response.code === 301) {
                    window.location.href = response.message
                } else {
                    throw response
                }
            })
    }

    private readonly handleUpdateTags = (tags: Tag[]) => {
        const replay = {
            ...this.state.replay!,
            tags
        }
        this.setState({replay})
    }
}

export const ReplayPage = withTheme(ReplayPageComponent)
