import * as d3 from "d3"
import * as React from "react"
import { TeamPie } from "./TeamPie"

interface State {
    element: any
}

interface Props {
    data: number[][]
    rotationEnabled: boolean
    onMouseover?: (index: number, data: any) => void
    onMouseout?: (index: number, data: any) => void
}

export class BoostField extends React.PureComponent<Props, State> {

    public render() {
        const {data, rotationEnabled, onMouseover, onMouseout} = this.props
        const boosts = [
            [100, 125],
            [250, 125],
            [400, 125],
            [100, 375],
            [250, 375],
            [400, 375]
        ]
        const rotate = [1, 1, -1, 1, 1, -1]
        return (

            <svg width={500}
                 height={500}
                 ref={(element) => (this.state = {element: d3.select(element)})}
                 key={"field"}>
                <image x="0" y="0" width="500" height="500" href="/field.jpg"/>
                {boosts.map((item: any, index: number) => <TeamPie blue={data[index][0]}
                                                                   orange={data[index][1]} x={item[0]}
                                                                   y={item[1]}
                                                                   size={30}
                                                                   rotate={rotationEnabled ? rotate[index] : 0}
                                                                   onMouseover={() => {
                                                                       if (onMouseover !== undefined) {
                                                                           onMouseover(index, data)
                                                                       }
                                                                   }}
                                                                   onMouseout={() => {
                                                                       if (onMouseout !== undefined) {
                                                                           onMouseout(index, data)
                                                                       }
                                                                   }}/>)}
            </svg>
        )
    }

}
