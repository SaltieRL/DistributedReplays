import { Grid } from "@material-ui/core"
import * as React from "react"
import { ItemFull, ItemUsage } from "../../Models/ItemStats"
import { ItemBreadcrumbs } from "./ItemBreadcrumbs"
import { ItemDisplay } from "./ItemDisplay"
import { ItemStatsGraph } from "./ItemStatsGraph"
import { ItemStatsUsers } from "./ItemStatsUsers"

interface Props {
    item: ItemFull | undefined,
    itemData: ItemFull | undefined,
    itemUsage: ItemUsage | undefined
}

export class ItemView extends React.Component<Props> {
    public render() {
        const breadCrumbs = this.props.itemData ? (
            <ItemBreadcrumbs itemData={this.props.itemData}/>
        ) : null
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    {breadCrumbs}
                </Grid>
                <Grid item xs={6} lg={3}>
                    <Grid item xs={12}>
                        {this.props.item && <ItemDisplay item={this.props.item} paint={0}/>}
                    </Grid>
                </Grid>
                {this.props.itemData && this.props.itemUsage && <>
                    <Grid item xs={6} lg={3}>
                        <ItemStatsUsers item={this.props.itemData}
                                        itemUsage={this.props.itemUsage}/>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <ItemStatsGraph item={this.props.itemData}
                                        itemUsage={this.props.itemUsage}/>
                    </Grid>
                </>}
            </Grid>
        )
    }
}
