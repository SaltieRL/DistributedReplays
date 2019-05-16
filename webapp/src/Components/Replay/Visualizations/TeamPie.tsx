import * as d3 from "d3"
import * as React from "react"

interface Props {
    onClick?: () => null
    blue: number
    orange: number
    size: number
    x: number
    y: number
}

interface State {
    element: any
}

export class TeamPie extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {element: null}
    }

    public render() {
        return <g ref={(element) => (this.state = {element: d3.select(element)})}/>

    }

    public componentDidMount(): void {
        const {onClick, blue, orange, size, x, y} = this.props
        const smallArc = d3.arc()
            .outerRadius(size - 10)
            .innerRadius(0)

        const event = (d: any, i: any) => {

            if (onClick) {
                onClick()
            }
        }
        const colorArray = ["#ff8c00", "#0078c4"]
        // const color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
        const vis = this.state.element.append("svg:g")
            .attr("transform", "translate(" + x + "," + y + ")")
            .on("click", event)

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
            .attr("d", smallArc)
            .attr("fill", (d: any, i: any) => {
                // return color(d.data.toString())
                return colorArray[i]
            })
    }

}