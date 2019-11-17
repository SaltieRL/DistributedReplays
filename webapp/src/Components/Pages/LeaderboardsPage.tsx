import { Grid } from "@material-ui/core"
import * as React from "react"
import { getLeaderboards } from "../../Requests/Global"
import { PlaylistLeaderboardGrid } from "../Leaderboards/PlaylistLeaderboardGrid"
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
                <Grid container spacing={3} justify="center">
                    <LoadableWrapper load={this.getLeaderboards}>
                        {this.state.leaderboards &&
                        <PlaylistLeaderboardGrid leaderboards={this.state.leaderboards}/>
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
