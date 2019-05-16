import { Divider } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { getBoostmap } from "../../../Requests/Replay"
import { LoadableWrapper } from "../../Shared/LoadableWrapper"
import { BoostMapWrapper } from "./BoostMapWrapper"

interface Props {
    replay: Replay
}

interface State {
    element: any
    reloadSignal: boolean
    boostmapData: any
}

export class VisualizationsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {element: null, reloadSignal: false, boostmapData: null}
    }

    public render() {
        return (
            <>
                <Divider/>
                <LoadableWrapper load={this.getBoostmapsData} reloadSignal={this.state.reloadSignal}>
                    <BoostMapWrapper data={this.state.boostmapData} />
                </LoadableWrapper>
            </>
        )
    }

    private readonly getBoostmapsData = () => {
        return getBoostmap(this.props.replay.id)
            .then((data) => this.setState({boostmapData: data}))
    }

}
