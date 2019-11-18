import { createStyles, Grid, Typography, WithStyles, withStyles } from "@material-ui/core"
import DirectionsCar from "@material-ui/core/SvgIcon/SvgIcon"
import * as React from "react"
import { roundNumberToMaxDP } from "../../../../../Utils/String"

const styles = createStyles({
    percentage: {
        padding: 5,
        textAlign: "center",
        borderTop: "1px solid rgb(70, 70, 70)",
        borderBottom: "1px solid rgb(70, 70, 70)"
    }
})

interface OwnProps {
    carStat: CarStat
}

type Props = OwnProps & WithStyles<typeof styles>

class FavouriteCarComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <Grid container alignItems="center" justify="space-around" spacing={1}>
                <Grid item xs={3}>
                    <Typography> <DirectionsCar/> </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1">
                        favourite car
                    </Typography>
                </Grid>
                <Grid item xs={3} container direction="column" alignItems="center">
                    <Grid item>
                        <Typography align="center">
                            {this.props.carStat.carName}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={this.props.classes.percentage}>
                            {roundNumberToMaxDP(this.props.carStat.carPercentage * 100, 1)}%
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export const FavouriteCar = withStyles(styles)(FavouriteCarComponent)
