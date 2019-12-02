import {Grid, Typography} from "@material-ui/core"
import * as _ from "lodash"
import * as React from "react"
import {LoadoutItemDisplay} from "./Loadout/LoadoutItemDisplay"

interface Props {
    loadout: Loadout
}

export class LoadoutDisplay extends React.PureComponent<Props> {
    public render() {
        return (
            <div style={{padding: 24}}>
                <Grid container spacing={3} justify="center" alignItems="center">
                    {_.toPairs(this.props.loadout).map(([key, value]: [string, LoadoutItem]) => (
                        <Grid item key={key}>
                            <LoadoutItemDisplay name={key} {...value} />
                        </Grid>
                    ))}
                    <Grid item xs={12} style={{padding: 24, textAlign: "center"}}>
                        <Typography component="span">
                            Images courtesy of{" "}
                            <a
                                href="https://rocket-league.com/"
                                target="_blank"
                                rel="noreferrer noopener"
                                style={{textDecoration: "none", display: "inline-flex", alignItems: "center"}}
                            >
                                <Typography>ROCKET LEAGUE GARAGE</Typography>
                                <img
                                    height="20px"
                                    alt={"RLGarage Logo"}
                                    style={{marginLeft: "5px"}}
                                    src={
                                        "https://rocket-league.com/assets/images/logos/rocket-league-garage-footer.svg"
                                    }
                                />
                            </a>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
