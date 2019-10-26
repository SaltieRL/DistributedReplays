import * as d3 from "d3"
import * as React from "react"
import {PlayerStartEnd} from "./PlayerStartEnd";
import {rgb} from "d3";

interface Props {
    player_list: any
    players: any
    onMouseover?: (i: number, data: any) => void
    onMouseout?: (i: number, data: any) => void
    height: number
    width: number
}

interface State {
    element: d3.Selection<SVGSVGElement | null, {}, null, undefined> | null
}

export class KickoffField extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {element: null}
    }

    public render() {
        const {player_list, onMouseover, onMouseout} = this.props

        return (
            <svg width={this.props.width}
                 height={this.props.height}
                 ref={this.state.element === null ?
                     (element) => {
                         this.setState({element: d3.select(element)})
                     } : undefined}
                 key={"field"}>
                <image x="0" y="0" width={this.props.width} height={this.props.height} href="/fieldblack.png"/>
                {player_list.map((player_data: any, i: number) => (
                    <PlayerStartEnd key={i}
                             color={this.props.players[player_data.player_id].is_orange?
                                 rgb(187,113,45): rgb(68,135,240)}
                             startX={player_data.start.x}
                             startY={player_data.start.y}
                             endX={player_data.end.x}
                             endY={player_data.end.y}
                             imageWidth = {this.props.width}
                             imageHeight = {this.props.height}
                             onMouseover={() => {
                                 if (onMouseover !== undefined) {
                                     onMouseover(i, player_data)
                                 }
                             }}
                             onMouseout={() => {
                                 if (onMouseout !== undefined) {
                                     onMouseout(i, player_data)
                                 }
                             }}/>
                ))}
            </svg>
        )
    }
}
