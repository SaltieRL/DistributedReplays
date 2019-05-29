import { Card, CardHeader, Grid } from "@material-ui/core"
import * as React from "react"
import { getLeaderboards } from "../../Requests/Global"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

interface Props {

}

interface State {
    leaderboards?: PlaylistLeaderboard[]
}

export class LeaderboardsPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <LoadableWrapper load={this.getLeaderboards}>
                        {this.state.leaderboards &&
                        <Card>
                            <CardHeader title="Leaderboards"/>
                        </Card>
                        }
                    </LoadableWrapper>
                </Grid>
            </BasePage>
        )
    }
    private readonly getLeaderboards = (): Promise<void> => {
        return getLeaderboards()
            .then((leaderboards) => this.setState({leaderboards}))
    }
}
