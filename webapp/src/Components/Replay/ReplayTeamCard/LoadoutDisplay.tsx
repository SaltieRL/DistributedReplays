import { Grid, Typography } from "@material-ui/core"
import * as _ from "lodash"
import * as React from "react"
import { LoadoutItemDisplay } from "./LoadoutItemDisplay"

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
                            <LoadoutItemDisplay key={key} slot={key} item={value}/>
                        )
                    })}
                    <Grid item xs={12} style={{padding: 24, textAlign: "center"}}>
                        <Typography>
                            Images courtesy of <a
                            href={"https://rocket-league.com/"}
                            target="_blank"
                            rel="noreferrer noopener"
                            style={{textDecoration: "none", display: "inline-flex"}}
                        > <Typography>ROCKET LEAGUE GARAGE</Typography>
                            <img
                                height={"20px"}
                                alt={"RLGarage Logo"}
                                style={{marginLeft: "5px"}}
                                src={"https://rocket-league.com/assets/images/logos/rocket-league-garage-footer.svg"}/>
                        </a>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

