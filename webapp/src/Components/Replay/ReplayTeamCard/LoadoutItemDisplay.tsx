import { Grid, TextField, Tooltip } from "@material-ui/core"
import * as React from "react"
import { convertSnakeAndCamelCaseToReadable } from "../../../Utils/String"

interface Props {
    slot: string
    item: LoadoutItem
}

const PAINT_COLOR_MAP = {
    6: "#4c1101",
    2: "#7efd01",
    12: "#FFFFFF",
    4: "#3f51b4",
    1: "#d40001",
    7: "#4cae50",
    11: "#777777",
    10: "#f3b301",
    9: "#fd4080",
    8: "#9C27B0",
    13: "#fdea3b",
    5: "#03a8f3",
    3: "#111111"
}
const PAINT_MAP = {
    0: "None",
    1: "Crimson",
    2: "Lime",
    3: "Black",
    4: "Cobalt",
    5: "Sky Blue",
    6: "Burnt Sienna",
    7: "Forest Green",
    8: "Purple",
    9: "Pink",
    10: "Orange",
    11: "Grey",
    12: "Titanium White",
    13: "Saffron"
}


export class LoadoutItemDisplay extends React.PureComponent<Props> {
    public render() {
        const {slot, item} = this.props
        return (
            (item.itemName !== "None" && item.itemName !== "Unknown") ?
                (
                    <Grid container style={{width: "134px", margin: "10px"}} key={slot}>
                        <Grid item xs={12} style={{overflow: "hidden", height: "134px", position: "relative"}}>
                            <img alt={item.itemName} src={item.imageUrl} height={"134px"}/>
                            {item.paintId > 0 ? (
                                <Tooltip title={PAINT_MAP[item.paintId]}>
                                    <div style={{
                                        backgroundColor: PAINT_COLOR_MAP[item.paintId],
                                        border: "2px solid rgba(255,255,255,.3)",
                                        transform: "rotate(45deg)",
                                        width: "35px",
                                        height: "20px",
                                        position: "absolute",
                                        left: "85%",
                                        top: "-6px",
                                        zIndex: 999
                                    }}/>
                                </Tooltip>
                            ) : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id={slot}
                                label={convertSnakeAndCamelCaseToReadable(slot)}
                                value={item.itemName}
                                InputProps={{readOnly: true}}
                            />

                        </Grid>
                    </Grid>
                ) : null

        )
    }
}
