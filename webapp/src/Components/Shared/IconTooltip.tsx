import { createStyles, Theme, Tooltip, WithStyles, withStyles } from "@material-ui/core"
import Info from "@material-ui/icons/Info"
import * as React from "react"

export const styles = (theme: Theme) => createStyles({
    infoIcon: {
        verticalAlign: "middle",
        marginLeft: theme.spacing(1),
        marginTop: -4
    }
})

interface OwnProps {
    tooltip: string
}

type Props = OwnProps
    & WithStyles<typeof styles>

class IconTooltipComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, tooltip} = this.props
        return (
            <Tooltip title={tooltip}>
                <Info className={classes.infoIcon}/>
            </Tooltip>
        )
    }
}

export const IconTooltip = withStyles(styles)(IconTooltipComponent)
