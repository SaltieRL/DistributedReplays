import * as d3 from "d3"
import * as React from "react"

interface Props {
    player: KickoffPlayerElement
    color: d3.RGBColor
    imageWidth: number
    imageHeight: number
    onMouseover: () => void
    onMouseout: () => void
}

const FIELD_HALF_WIDTH = 4096
const FIELD_HALF_HEIGHT = 5120
const FIELD_GOAL_DEPTH = 892.755

interface State {
    element: d3.Selection<SVGGElement | null, {}, null, undefined> | null
    loaded: boolean
}

export class PlayerStartEnd extends React.PureComponent<Props, State> {
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
            const startX = this.props.player.start.x
            const startY = this.props.player.start.y
            const endX = this.props.player.end.x
            const endY = this.props.player.end.y
            const color = this.props.color
            const y = this.getModifiedX(startX)
            const x = this.getModifiedY(startY)
            const y2 = this.getModifiedX(endX)
            const x2 = this.getModifiedY(endY)
            const svgContainer: d3.Selection<SVGGElement, {}, null, undefined> = this.state.element.append("svg:g")
            this.createArrowHead(svgContainer, color)
            // .attr("transform", `translate(${x}, ${y})`)
            this.applyAttr(
                svgContainer
                    .append("line")
                    .on("mouseover", this.props.onMouseover)
                    .on("mouseout", this.props.onMouseout),
                {
                    class: "arrow",
                    "marker-end": `url(#${this.getArrowHeadId()})`,
                    x1: x,
                    y1: y,
                    x2,
                    y2,
                    stroke: color.brighter(2),
                    "stroke-width": 3
                }
            )

            // Starting circle
            this.applyAttr(
                svgContainer
                    .append("circle")
                    .on("mouseover", this.props.onMouseover)
                    .on("mouseout", this.props.onMouseout),
                {
                    cx: x,
                    cy: y,
                    r: 5,
                    fill: color.brighter(2)
                }
            )
            this.applyAttr(
                svgContainer
                    .append("circle")
                    .on("mouseover", this.props.onMouseover)
                    .on("mouseout", this.props.onMouseout),
                {
                    cx: x2,
                    cy: y2,
                    r: 4,
                    fill: color.brighter()
                }
            )
        }
    }

    private readonly createArrowHead = (
        svgContains: d3.Selection<SVGGElement, {}, null, undefined>,
        color: d3.RGBColor
    ) => {
        const defs = svgContains.append("defs")

        this.applyAttr(defs.append("marker"), {
            id: this.getArrowHeadId(),
            viewBox: "0 -5 10 10",
            refX: 10,
            refY: 0,
            markerWidth: 4,
            markerHeight: 4,
            orient: "auto"
        })
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("class", "arrowHead")
            .style("fill", color.brighter(2))
    }

    private readonly getArrowHeadId = () => `arrow${this.props.player.player_id}`

    private readonly applyAttr = (svgElement: any, attributes: any) => {
        let chainer = svgElement
        Object.keys(attributes).forEach((key: string) => {
            chainer = chainer.attr(key, attributes[key])
        })
        return chainer
    }

    private readonly getModifiedX = (x: number) => {
        return (((FIELD_HALF_WIDTH + x) / FIELD_HALF_WIDTH) * this.props.imageHeight) / 2
    }

    private readonly getModifiedY = (y: number) => {
        return (
            (((FIELD_HALF_HEIGHT + y + FIELD_GOAL_DEPTH) / (FIELD_HALF_HEIGHT + FIELD_GOAL_DEPTH)) *
                this.props.imageWidth) /
            2
        )
    }
}
