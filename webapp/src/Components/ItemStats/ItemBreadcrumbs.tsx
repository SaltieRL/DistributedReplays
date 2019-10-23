import { Paper, Typography } from "@material-ui/core"
import { Breadcrumbs } from "@material-ui/lab"
import * as React from "react"
import { Link } from "react-router-dom"
import { ITEMS_LINK } from "../../Globals"
import { ItemFull } from "../../Models/ItemStats"

export const ItemBreadcrumbs = (props: { itemData: ItemFull }) => {
    return (
        <Paper elevation={0}>
            <Breadcrumbs aria-label="breadcrumb" style={{padding: "5px"}}>
                <Link color="inherit" to={ITEMS_LINK} style={{textDecoration: "none"}}>
                    <Typography variant="subtitle1" color="textPrimary">
                        Items
                    </Typography>
                </Link>
                <Typography variant="subtitle1" color="textPrimary">{props.itemData.name}</Typography>
            </Breadcrumbs>
        </Paper>
    )
}
