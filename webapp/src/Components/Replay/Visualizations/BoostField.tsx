import * as d3 from "d3"
import * as React from "react"
import {TeamPie} from "./TeamPie"

interface Coordinate {
    x: number
    y: number
}

const boostLocations: Coordinate[] = [
    {x: 90, y: 50},
    {x: 250, y: 40},
    {x: 410, y: 50},
    {x: 90, y: 300},
    {x: 250, y: 310},
    {x: 410, y: 300}
]

interface Props {
    data: number[][]
    rotationEnabled: boolean
    onMouseover?: (i: number, data: any) => void
    onMouseout?: (i: number, data: any) => void
}

interface State {
    element: d3.Selection<SVGSVGElement | null, {}, null, undefined> | null
}

export class BoostField extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {element: null}
    }

    public render() {
        const {data, rotationEnabled, onMouseover, onMouseout} = this.props

        const rotate = [1, 1, -1, 1, 1, -1]
        return (
            <svg
                width={500}
                height={350}
                ref={
                    this.state.element === null
                        ? (element) => {
                              this.setState({element: d3.select(element)})
                          }
                        : undefined
                }
                key={"field"}
            >
                <image x="0" y="0" width={500} height={350} href="/fieldblack.png" />
                {boostLocations.map((boostCoordinate, i) => (
                    <TeamPie
                        key={i}
                        blue={data[i][0]}
                        orange={data[i][1]}
                        x={boostCoordinate.x}
                        y={boostCoordinate.y}
                        size={30}
                        rotate={rotationEnabled ? rotate[i] : 0}
                        onMouseover={() => {
                            if (onMouseover !== undefined) {
                                onMouseover(i, data)
                            }
                        }}
                        onMouseout={() => {
                            if (onMouseout !== undefined) {
                                onMouseout(i, data)
                            }
                        }}
                    />
                ))}
            </svg>
        )
    }
}
