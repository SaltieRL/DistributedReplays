import {createStyles, WithStyles, withStyles} from "@material-ui/core"
import * as d3 from "d3"
import * as React from "react"
import {PlayerStartEnd} from "./PlayerStartEnd"

const styles = createStyles({
    svgWrapper: {
        overflowX: "auto",
        textAlign: "center",
        width: "100%"
    }
})

interface OwnProps {
    playerList: any
    players: any
    onMouseover?: (i: number) => void
    onMouseout?: (i: number) => void
    height: number
    width: number
}

type Props = OwnProps & WithStyles<typeof styles>

interface State {
    element: d3.Selection<SVGSVGElement | null, {}, null, undefined> | null
}

class KickoffFieldComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {element: null}
    }

    public render() {
        const {classes, playerList, onMouseover, onMouseout} = this.props

        return (
            <div className={classes.svgWrapper}>
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
                >
                    <image x="0" y="0" width={this.props.width} height={this.props.height} href="/fieldblack.png" />
                    {playerList.map((playerData: any, i: number) => (
                        <PlayerStartEnd
                            key={JSON.stringify(playerData)}
                            color={
                                this.props.players[playerData.player_id].is_orange
                                    ? d3.rgb(187, 113, 45)
                                    : d3.rgb(68, 135, 240)
                            }
                            player={playerData}
                            imageWidth={this.props.width}
                            imageHeight={this.props.height}
                            onMouseover={onMouseover ? () => onMouseover(i) : () => undefined}
                            onMouseout={onMouseout ? () => onMouseout(i) : () => undefined}
                        />
                    ))}
                </svg>
            </div>
        )
    }
}

export const KickoffField = withStyles(styles)(KickoffFieldComponent)
