import { Grid } from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { TrainingPackResponse } from "../../Models/Player/TrainingPack"
import { StoreState } from "../../Redux"
import { getTrainingPacks } from "../../Requests/Global"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { TrainingPackResultDisplay } from "../Training/TrainingPackResultDisplay"
import { BasePage } from "./BasePage"
import Typography from "@material-ui/core/Typography"

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

interface State {
    trainingPacks?: TrainingPackResponse
    timerID?: number
    reloadSignal: boolean
}

type Props = ReturnType<typeof mapStateToProps>

class TrainingPackPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    {(this.props.loggedInUser && this.props.loggedInUser.beta) ?
                        <LoadableWrapper load={this.getLeaderboards} reloadSignal={this.state.reloadSignal}>
                            {this.state.trainingPacks &&
                            <Grid item xs={12} md={8}>
                                <TrainingPackResultDisplay trainingPacks={this.state.trainingPacks} page={0}
                                                           limit={10}/>
                            </Grid>
                            }

                        </LoadableWrapper>
                        :
                        <Typography>In beta, Patrons only.</Typography>
                    }
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
export const TrainingPackPage =  connect(mapStateToProps)(TrainingPackPageComponent)
