import { Grid } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import * as React from "react"
import { connect } from "react-redux"
import { TrainingPackResponse } from "../../Models/Player/TrainingPack"
import { StoreState } from "../../Redux"
import { getTrainingPacks } from "../../Requests/Global"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { TrainingPackResultDisplay } from "../Training/TrainingPackResultDisplay"
import { BasePage } from "./BasePage"

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

interface State {
    trainingPacks?: TrainingPackResponse
    timerID?: number
    reloadSignal: boolean
    page: number
    limit: number
}

type Props = ReturnType<typeof mapStateToProps>

class TrainingPackPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false, page: 0, limit: 10}
    }

    public render() {
        return (
            <BasePage>
                <Grid container spacing={3} justify="center">
                    {(this.props.loggedInUser && this.props.loggedInUser.beta) ? (
                        <LoadableWrapper load={this.getTrainingPacks} reloadSignal={this.state.reloadSignal}>
                            {this.state.trainingPacks && (
                                <Grid item xs={12} md={8}>
                                    <TrainingPackResultDisplay
                                        trainingPacks={this.state.trainingPacks}
                                        page={this.state.page}
                                        limit={this.state.limit}
                                        handleChangePage={this.handleChangePage}
                                        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    />
                                </Grid>
                            )}
                        </LoadableWrapper>
                    ) : (
                        <Typography>In beta, Patrons only.</Typography>
                    )}
                </Grid>
            </BasePage>
        )
    }

    // private timer = () => window.setInterval(() => { // return the timeoutID
    //     this.setState({reloadSignal: !this.state.reloadSignal})
    // }, 5000)

    private readonly getTrainingPacks = (): Promise<void> => {
        return getTrainingPacks(this.state.page, this.state.limit)
            .then((packs: TrainingPackResponse) => this.setState({trainingPacks: packs}))
    }

    private readonly handleChangePage = (event: unknown, page: number) => {
        this.setState({page}, () => {
            this.getTrainingPacks()
        })
    }

    private readonly handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> =
        (event) => {
            this.setState({limit: Number(event.target.value)}, () => {
                this.getTrainingPacks()
            })
        }
}

export const TrainingPackPage = connect(mapStateToProps)(TrainingPackPageComponent)
