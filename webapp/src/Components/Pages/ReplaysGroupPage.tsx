import { Divider, Grid } from "@material-ui/core"
import _ from "lodash"
import qs from "qs"
import * as React from "react"
import { RouteComponentProps } from "react-router-dom"
import { Replay } from "../../Models"
import { getReplay } from "../../Requests/Replay"
import { AddReplayInput } from "../ReplaysGroup/AddReplayInput"
import { ReplayChip } from "../ReplaysGroup/ReplayChip"
import { ReplaysGroupContent } from "../ReplaysGroup/ReplaysGroupContent"
import { WithNotifications, withNotifications } from "../Shared/Notification/NotificationUtils"
import { BasePage } from "./BasePage"

interface ReplayQueryParams {
    ids: string[]
}

type Props = RouteComponentProps<{}>
    & WithNotifications

interface State {
    ids: string[]
    replays: Replay[]
    inputId: string
}

class ReplaysGroupPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {ids: [], replays: [], inputId: ""}
    }

    public componentDidMount() {
        this.readQueryParams()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (prevState.ids !== this.state.ids) {
            // Set params if updated through input
            this.setQueryParams()

            // Get replay data on first load
            if (this.state.replays.length === 0) {
                this.getReplays()
            }
        }
    }

    public render() {
        const {replays} = this.state
        const replayChips = replays.map((replay) => (
            <ReplayChip {...replay} onDelete={() => this.handleRemoveReplay(replay.id)} key={replay.id}/>
        ))
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={12} container justify="center">
                        <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                            <AddReplayInput onSubmit={this.attemptToAddReplay}
                                            value={this.state.inputId}
                                            onChange={this.handleInputChange}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={11} md={10} lg={9} xl={8} container spacing={8}>
                        {replayChips.map((replayChip) => (
                            <Grid item key={replayChip.key as string}>
                                {replayChip}
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item xs={12}> <Divider/> </Grid>
                    <Grid item xs={12}>
                        <ReplaysGroupContent replays={replays}/>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly readQueryParams = () => {
        const queryString = this.props.location.search
        if (queryString !== "") {
            const queryParams: ReplayQueryParams = qs.parse(
                this.props.location.search,
                {ignoreQueryPrefix: true}
            )
            if (queryParams.ids) {
                const ids = Array.isArray(queryParams.ids) ? queryParams.ids : [queryParams.ids]
                this.setState({ids: _.uniq(ids)})
            }
        }
    }

    // TODO: Compartmentalise query params, data retrieval
    private readonly setQueryParams = () => {
        const queryString = qs.stringify(
            {ids: this.state.ids},
            {addQueryPrefix: true, indices: false}
        )
        this.props.history.replace({search: queryString})
    }

    private readonly getReplays = (): Promise<void> => {
        return Promise.all(this.state.ids.map((id) => getReplay(id)))
            .then((replays) => this.setState({replays}))
    }

    private readonly handleRemoveReplay = (id: string) => {
        const index = this.state.ids.indexOf(id)
        try {
            this.setState({
                ids: removeIndexFromArray(this.state.ids, index),
                replays: removeIndexFromArray(this.state.replays!, index)
            })
        } catch {
            this.props.showNotification({variant: "error", message: "Error removing replay", timeout: 2000})
        }
    }

    private readonly handleAddReplay = (replay: Replay) => {
        const {ids, replays} = this.state
        this.setState({
            ids: [...ids, replay.id],
            replays: [...replays, replay]
        })
    }

    private readonly handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.setState({inputId: event.target.value})
    }

    private readonly attemptToAddReplay = () => {
        const {inputId, ids} = this.state
        if (inputId === "") {
            // TODO: Make input red to gain user's attention?
            return
        }

        if (ids.indexOf(inputId) === -1) {
            getReplay(inputId)
                .then(this.handleAddReplay)
                .then(() => this.setState({inputId: ""}))
                .catch(() => {
                    this.props.showNotification({
                        variant: "error",
                        message: "Entered id is not a known replay",
                        timeout: 3000
                    })
                })
                .catch((e: any) => {
                    // console.log(e) // TypeError expected here when above .catch catches something.
                    // TODO: Figure out what the right thing to do here is.
                })
        } else {
            this.props.showNotification({
                variant: "info",
                message: "Entered id has already been added",
                timeout: 2000
            })
        }
    }
}

export const ReplaysGroupPage = withNotifications()(ReplaysGroupPageComponent)

const removeIndexFromArray = <T extends {}>(array: T[], index: number): T[] => {
    return array.filter((__, i) => i !== index)
}
