import { Grid, Link, TextField, Typography } from "@material-ui/core"
import * as _ from "lodash"
import * as React from "react"
import { convertSnakeAndCamelCaseToReadable } from "../../../Utils/String"

interface Props {
    loadout: Loadout
}

export class LoadoutDisplay extends React.PureComponent<Props> {
    public render() {
        return (
            <div style={{padding: 24}}>
                <Grid container spacing={24} justify="center" alignItems="center">
                    {_.toPairs(this.props.loadout).map(([key, value]: [string, LoadoutItem]) => {
                        return (
                            (value.itemName !== "None") ?
                                <Grid item xs={12} md={3} lg={3} key={key}>
                                    <img src={value.imageUrl} height={"134px"}/>
                                    <TextField
                                        id={key}
                                        label={convertSnakeAndCamelCaseToReadable(key)}
                                        value={value.itemName}
                                        InputProps={{readOnly: true}}
                                    />
                                </Grid> : null
                        )
                    })}
                    <Grid item xs={12} style={{padding: 24, textAlign: "center"}}>
                        <Typography>
                            Images courtesy of <Link href={"https://rocket-league.com/"}
                                                     style={{textDecoration: "none"}}>ROCKET LEAGUE GARAGE <img
                            height={"20px"}
                            alt={"RLGarage Logo"}
                            src={"https://rocket-league.com/assets/images/logos/rocket-league-garage-footer.svg"}/></Link>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
