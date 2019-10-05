import { Grid } from "@material-ui/core"
import * as React from "react"
import { getTrainingPacks } from "../../Requests/Global"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"
import { TrainingPackResultDisplay } from "../Training/TrainingPackResultDisplay"
import { TrainingPackResponse } from "../../Models/Player/TrainingPack"

interface Props {

}

interface State {
    trainingPacks?: TrainingPackResponse
}

export class TrainingPackPage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <LoadableWrapper load={this.getLeaderboards}>
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

    private readonly getLeaderboards = (): Promise<void> => {
        return getTrainingPacks()
            .then((packs: TrainingPackResponse) => this.setState({trainingPacks: packs}))
    }
}
