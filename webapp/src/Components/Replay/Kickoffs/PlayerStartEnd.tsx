import * as d3 from "d3"
import * as React from "react"

interface Props {
    color: any
    startX: number
    startY: number
    endX: number
    endY: number
    imageWidth: number
    imageHeight:number
    onMouseover?: () => void
    onMouseout?: () => void
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
            const {color, startX, startY, endX, endY} = this.props
            let y = this.getModifiedX(startX)
            let x = this.getModifiedY(startY)
            let y2 = this.getModifiedX(endX)
            let x2 = this.getModifiedY(endY)
            const svgContainer = this.state.element.append("svg:g")
            this.createArrowHead(svgContainer, color)
               // .attr("transform", `translate(${x}, ${y})`)
            this.applyAttr(svgContainer.append('line'), {
                "class":"arrow",
                "marker-end":"url(#arrow)",
                "x1":x,
                "y1":y,
                "x2":x2,
                "y2":y2,
                "stroke":color.brighter(2),
                "stroke-width":3
            })

            // Starting circle
            this.applyAttr(svgContainer.append('circle'), {
                "cx": x,
                "cy": y,
                "r": 5,
                "fill": color.brighter(2)
            })
            this.applyAttr(svgContainer.append('circle'), {
                "cx": x2,
                "cy": y2,
                "r": 4,
                "fill": color.brighter()
            })
        }
    }

    private readonly createArrowHead = (svgContains: any, color: any) => {
        const defs = svgContains.append("defs")

        this.applyAttr(defs.append("marker"),{
            "id":"arrow",
            "viewBox":"0 -5 10 10",
            "refX":10,
            "refY":0,
            "markerWidth":4,
            "markerHeight":4,
            "orient":"auto",
        }).append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("class","arrowHead")
            .style("fill", "WhiteSmoke");
    }

    private readonly applyAttr = (svgElement: any, attributes:any) => {
        let chainer = svgElement
        Object.keys(attributes).forEach((key: string, index: number) => {
            chainer = chainer.attr(key, attributes[key])
        })
        return chainer
    }

    private readonly getModifiedX = (x: number) => {
        return (FIELD_HALF_WIDTH + x) / FIELD_HALF_WIDTH * this.props.imageHeight / 2
    }

    private readonly getModifiedY = (y: number) => {
        return (FIELD_HALF_HEIGHT + y + FIELD_GOAL_DEPTH) / (FIELD_HALF_HEIGHT + FIELD_GOAL_DEPTH) * this.props.imageWidth / 2
    }
}
