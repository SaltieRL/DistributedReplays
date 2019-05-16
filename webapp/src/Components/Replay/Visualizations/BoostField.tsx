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
                 ref={(element) => (this.state = {element: d3.select(element)})}>
                <image x="0" y="0" width="500" height="500" href="/field.jpg"/>
                {boosts.map((item: any, index: number) => <TeamPie blue={data[index][0]}
                                                                   orange={data[index][1]} x={item[0]}
                                                                   y={item[1]}
                                                                   size={30}
                                                                   rotate={rotationEnabled ? rotate[index] : 0}
                                                                   onMouseover={() => {
                                                                       console.log("mouseover", index)
                                                                       onMouseover !== undefined
                                                                           ? onMouseover(index, data) : null
                                                                   }}
                                                                   onMouseout={() => {
                                                                       console.log("mouseout", index)
                                                                       onMouseout !== undefined
                                                                           ? onMouseout(index, data) : null
                                                                   }}/>)}
            </svg>
        )
    }

    public addCircle = (cx: number, cy: number, radius: number, border: string, color: string) => {
        this.state.element.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", radius)
            .style("stroke", border)
            .style("fill", color)
    }

    public drawFrame = () => {
        // this.drawField()
        // const center = 250

        // this.addCircle(center, center, 20, "red", "red")

    }

    public drawField = () => {
        this.state.element.append("svg:image")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 500)
            .attr("height", 500)
            .attr("xlink:href", "/field.jpg")
    }

    public drawBoosts = () => {
    }

    public componentDidMount(): void {
        this.drawFrame()
    }

    public onMouseover = (index: any) => {

    }

}
