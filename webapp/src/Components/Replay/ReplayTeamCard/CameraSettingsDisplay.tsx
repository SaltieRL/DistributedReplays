import { Grid, TextField } from "@material-ui/core"
import * as _ from "lodash"
import * as React from "react"
import { convertSnakeAndCamelCaseToReadable, roundNumberToMaxDP } from "../../../Utils/String"

interface Props {
    cameraSettings: CameraSettings
}

export class CameraSettingsDisplay extends React.PureComponent<Props> {
    public render() {
        return (
            <div style={{padding: 24}}>
                <Grid container spacing={24}>
                    {_.toPairs(this.props.cameraSettings).map(([key, value]: [string, number]) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                                <TextField
                                    id={key}
                                    label={convertSnakeAndCamelCaseToReadable(key)}
                                    value={roundNumberToMaxDP(value)}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        )
    }
}
