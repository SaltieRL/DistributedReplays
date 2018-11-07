import { Grid } from "@material-ui/core"
import * as React from "react"
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom"
import { Replay } from "src/Models"
import { getReplay } from "../../Requests/Replay"
import { ReplayView } from "../Replay/ReplayView"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

interface RouteParams {
    id: string
}

type Props = RouteComponentProps<RouteParams>

interface State {
    replay?: Replay
}

export class ReplayPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        const matchUrl = this.props.match.url
        const {replay} = this.state

        return (
            <BasePage backgroundImage={"/replay_page_background.png"}>
                <Grid container spacing={24} justify="center" style={{minHeight: "100%"}}>
                    <LoadableWrapper load={this.getReplay}>
                        {replay &&
                        <Switch>
                            <Route
                                exact path={matchUrl}
                                render={() => (
                                    <ReplayView
                                        replay={replay}
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

    private readonly getReplay = (): Promise<void> => {
        return getReplay(this.props.match.params.id)
            .then((replay) => this.setState({replay}))
    }

    private readonly handleUpdateTags = (tags: Tag[]) => {
        const replay = {
            ...this.state.replay!,
            tags
        }
        this.setState({replay})
    }
}
