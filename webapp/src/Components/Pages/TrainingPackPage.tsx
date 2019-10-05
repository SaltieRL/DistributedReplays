import { Grid } from "@material-ui/core"
import * as React from "react"
import { TrainingPackResponse } from "../../Models/Player/TrainingPack"
import { getTrainingPacks } from "../../Requests/Global"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { TrainingPackResultDisplay } from "../Training/TrainingPackResultDisplay"
import { BasePage } from "./BasePage"

interface Props {

}

interface State {
    trainingPacks?: TrainingPackResponse
    timerID?: number
    reloadSignal: boolean
}

export class TrainingPackPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public componentDidMount = (): void => {
        // this.setState({timerID: this.timer()})
    }

    public componentWillUnmount(): void {
        if (this.state.timerID) {
            window.clearInterval(this.state.timerID)
        }
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <LoadableWrapper load={this.getLeaderboards} reloadSignal={this.state.reloadSignal}>
                        {this.state.trainingPacks &&
                        <Grid item xs={12} md={8}>
                            <TrainingPackResultDisplay trainingPacks={this.state.trainingPacks} page={0} limit={10}/>
                        </Grid>
                        }

                    </LoadableWrapper>
                </Grid>
            </BasePage>
        )
    }

    // private timer = () => window.setInterval(() => { // return the timeoutID
    //     this.setState({reloadSignal: !this.state.reloadSignal})
    // }, 5000)

    private readonly getLeaderboards = (): Promise<void> => {
        return getTrainingPacks()
            .then((packs: TrainingPackResponse) => this.setState({trainingPacks: packs}))
    }
}
