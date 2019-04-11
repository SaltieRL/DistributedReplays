import { Divider } from "@material-ui/core"
import * as d3 from "d3"
import * as React from "react"
import { Replay } from "../../../Models"

interface Props {
    replay: Replay
}

interface State {
    element: any
}

interface PiePoint {
    name: string
    value: number
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
                <svg width={500}
                     height={500}
                     ref={(element) => (this.state = {element: d3.select(element)})}>
                </svg>

            </>
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
        this.drawField()
        const center = 250

        this.addCircle(center, center, 20, "red", "red")

        this.drawPieChart(30, [
            {
                name: "Squishy",
                value: 0.6
            },
            {
                name: "Chausette",
                value: 0.4
            }
        ], 200, 200)
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

    public drawPieChart = (size: number, data: PiePoint[], x: number, y: number) => {
        const color = "red"
        const vis = this.state.element.append("svg:g")
            .attr("transform", "translate(" + x + "," + y + ")")
        const arc = d3.arc()              // this will create <path> elements for us using arc data
            .outerRadius(size)

        const pie = d3.pie()           // this will create arc data for us given a list of values
            .value((d: any) => {
                return d
            })

        const arcs = vis.selectAll("g.slice")     // this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)                          // associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
            .enter()                            // this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                // create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
            .attr("class", "slice")    // allow us to style things in the slices (like text)

        arcs.append("svg:path")
            .attr("fill", (d: any, i: any) => {
                return color
            }) // set the color for each slice to be chosen from the color function defined above
            .attr("d", arc)                                    // this creates the actual SVG path using the associated data (pie) with the arc drawing function

        arcs.append("svg:text")                                     // add a label to each slice
            .attr("transform", (d: any) => {                    // set the label's origin to the center of the arc
                // we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0
                d.outerRadius = size
                return "translate(" + arc.centroid(d) + ")"        // this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          // center the text on it's origin
            .text((d: any, i: any) => {
                return data[i].name
            })

    }

    public componentDidMount(): void {
        this.drawFrame()
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {

    }
}
