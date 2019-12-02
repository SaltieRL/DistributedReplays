import {createStyles, Tooltip, withStyles, WithStyles} from "@material-ui/core"
import React from "react"
import {PAINT_COLOR_MAP, PAINT_MAP} from "./dataMaps"

const styles = createStyles({
    paintedTriangle: {
        position: "absolute",
        top: 0,
        right: 0,
        borderColor: "transparent",
        borderStyle: "solid",
        borderTopRightRadius: 5,
        borderWidth: 15
    }
})

interface OwnProps {
    paintId: number
}

type Props = OwnProps & WithStyles<typeof styles>

class PaintedTriangleComponent extends React.PureComponent<Props> {
    public render() {
        const paintColor = PAINT_COLOR_MAP[this.props.paintId] + "DD"

        return (
            <Tooltip title={PAINT_MAP[this.props.paintId]}>
                <div
                    className={this.props.classes.paintedTriangle}
                    style={{
                        borderRightColor: paintColor,
                        borderTopColor: paintColor
                    }}
                />
            </Tooltip>
        )
    }
}
export const PaintedTriangle = withStyles(styles)(PaintedTriangleComponent)
