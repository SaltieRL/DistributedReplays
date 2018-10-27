import { Grid, TextField } from "@material-ui/core"
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
                    {_.toPairs(this.props.loadout).map(([key, value]: [string, string]) => {
                        return (
                            <Grid item xs={12} key={key}>
                                <TextField
                                    id={key}
                                    label={convertSnakeAndCamelCaseToReadable(key)}
                                    value={value}
                                    InputProps={{readOnly: true}}
                                    fullWidth
                                />
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}
