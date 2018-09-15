import {Grid} from "@material-ui/core"
import * as React from "react"
import {RouteComponentProps} from "react-router-dom"
import {Replay} from "../../Models/Replay/Replay"
import {getReplay} from "../../Requests/Replay"
import {ReplayView} from "../Replay/ReplayView"
import {BasePage} from "./BasePage"


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

    public componentDidMount() {
        getReplay(this.props.match.params.id)
            .then((replay) => this.setState({replay}))
    }

    public render() {
        const {replay} = this.state
        return (
            <BasePage>
                <Grid container spacing={24} justify="center" style={{minHeight: "100%"}}>
                    {replay &&
                    <>
                        <Grid item xs={12}>
                            <ReplayView replay={replay}/>
                        </Grid>
                    </>
                    }
                </Grid>
            </BasePage>
        )
    }
}
