import { Divider } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { BoostField } from "./BoostField"

interface Props {
    replay: Replay
}

interface State {
    element: any
}

export class VisualizationsContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {element: null}
    }

    public render() {
        return (
            <>
                <Divider/>
                <BoostField data={
                    [
                        [0.9, 0.1],
                        [0.5, 0.5],
                        [0.05, 0.95],
                        [0.8, 0.2],
                        [0.4, 0.6],
                        [0.3, 0.7]
                    ]
                }/>
            </>
        )
    }

}
