import { Card, CardActionArea, CardMedia, Grid, Typography } from "@material-ui/core"
import * as React from "react"
import { Item } from "../../Models/ItemStats"
import { roundNumberToMaxDP } from "../../Utils/String"

interface Props {
    classes: any,
    onClick: () => void,
    item: Item
}

export class ItemListCard extends React.Component<Props> {
    public render() {
        return <Grid item xs={6} sm={2} lg={1}>
            <Card className={this.props.classes.itemListCard} style={{position: "relative"}}>
                <CardActionArea onClick={this.props.onClick}>
                    <CardMedia
                        className={this.props.classes.media}
                        image={this.props.item.image}
                        title={this.props.item.name}
                    />
                </CardActionArea>

                <div style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    zIndex: 1000,
                    background: "#0089d2",
                    padding: "2px 5px 0px",
                    borderRadius: "15px"
                }}>
                    <Typography style={{color: "white"}}>
                        {this.props.item.count && roundNumberToMaxDP(this.props.item.count * 100, 1)}%
                    </Typography>
                </div>
            </Card>

        </Grid>
    }
}
