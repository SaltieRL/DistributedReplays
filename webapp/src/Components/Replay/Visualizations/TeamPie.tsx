import * as d3 from "d3"
import * as React from "react"

interface Props {
    onClick?: () => null
    blue: number
    orange: number
    size: number
    x: number
    y: number
    rotate: number
    onMouseover?: () => void
    onMouseout?: () => void
}

interface State {
    element: d3.Selection<SVGGElement | null, {}, null, undefined> | null
    loaded: boolean
}

export class TeamPie extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {element: null, loaded: false}
    }

    public render() {
        return (
            <g
                ref={(element) => {
                    if (!this.state.loaded) {
                        this.setState({element: d3.select(element), loaded: true})
                    }
                }}
            />
        )
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
        if (this.state.element !== null && !prevState.loaded && this.state.loaded) {
            const {onClick, onMouseover, onMouseout, blue, orange, size, x, y, rotate} = this.props
            const smallArc = d3.arc()
                .outerRadius(size - 10)
                .innerRadius(0)

            const event = (d: any, i: any) => {
                if (onClick) {
                    onClick()
                }
            }
            const mouseover = (d: any, i: any) => {
                if (onMouseover) {
                    onMouseover()
                }
            }
            const mouseout = (d: any, i: any) => {
                if (onMouseout) {
                    onMouseout()
                }
            }
            const colorArray = ["#ff8c00", "#0078c4"]
            // const color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c",
            // "#ff8c00"])
            const vis = this.state.element.append("svg:g")
                .attr("transform", `translate(${x}, ${y}) rotate(${-rotate * 90 + .5 * rotate * 360.0 *
                (rotate === -1 ? orange : blue)})`)
                .on("click", event)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)

            const pie = d3.pie()           // this will create arc data for us given a list of values
                .sort(null)
                .value((d: any) => {
                    return d
                })

            //
            // var label = d3.arc()
            //     .outerRadius(size - 40)
            //     .innerRadius(size - 40)

            const arc = vis.selectAll(".arc")
                .data(pie([orange, blue]))
                .enter().append("g")
                .attr("class", "arc")

            arc.append("path")
                .attr("d", smallArc as any)
                .attr("fill", (d: any, i: any) => {
                    // return color(d.data.toString())
                    return colorArray[i]
                })
        }
    }
}
