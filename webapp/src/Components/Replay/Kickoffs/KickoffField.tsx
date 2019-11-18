import * as d3 from "d3"
import * as React from "react"
import {PlayerStartEnd} from "./PlayerStartEnd"

interface Props {
    playerList: any
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
        const {playerList, onMouseover, onMouseout} = this.props

        return (
            <svg
                width={this.props.width}
                height={this.props.height}
                ref={
                    this.state.element === null
                        ? (element) => {
                              this.setState({element: d3.select(element)})
                          }
                        : undefined
                }
                key={"field"}
            >
                <image x="0" y="0" width={this.props.width} height={this.props.height} href="/fieldblack.png" />
                {playerList.map((playerData: any, i: number) => (
                    <PlayerStartEnd
                        key={i}
                        color={
                            this.props.players[playerData.player_id].is_orange
                                ? d3.rgb(187, 113, 45)
                                : d3.rgb(68, 135, 240)
                        }
                        player={playerData}
                        imageWidth={this.props.width}
                        imageHeight={this.props.height}
                        onMouseover={() => {
                            if (onMouseover !== undefined) {
                                onMouseover(i, playerData)
                            }
                        }}
                        onMouseout={() => {
                            if (onMouseout !== undefined) {
                                onMouseout(i, playerData)
                            }
                        }}
                    />
                ))}
            </svg>
        )
    }
}
