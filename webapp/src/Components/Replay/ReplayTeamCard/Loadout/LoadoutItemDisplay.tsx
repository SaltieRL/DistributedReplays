import {createStyles, withStyles, WithStyles} from "@material-ui/core"
import React from "react"
import {RARITIES} from "./dataMaps"
import {PaintedTriangle} from "./PaintedTriangle"

const styles = createStyles({
    loadoutItem: {
        height: 128,
        width: 128,
        borderWidth: 3,
        borderRadius: 5,
        borderStyle: "solid",
        backgroundColor: "black",
        display: "inline-block",

        fontSize: 10,
        wordWrap: "break-word",
        flex: "0 0 auto",
        margin: 4,
        textAlign: "center",
        position: "relative",
        color: "white"
    },
    loadoutItemImage: {
        height: 120,
        width: 120,
        marginTop: 4
    },
    loadoutItemMiddleText: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
    loadoutItemBottomText: {
        position: "relative",
        bottom: 15,
        textShadow:
            "0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black"
    }
})

interface OwnProps {
    name: string
    rarity: number
    paintId: number
    itemName: string
    imageUrl: string
}

type Props = OwnProps & WithStyles<typeof styles>

class LoadoutItemDisplayComponent extends React.PureComponent<Props> {
    public render() {
        const rarityColor = RARITIES[this.props.rarity].rlgend
        const {classes} = this.props
        return (
            <div className={classes.loadoutItem} style={{borderColor: rarityColor}}>
                {this.props.imageUrl !== "" ? (
                    <>
                        <img alt={this.props.itemName} src={this.props.imageUrl} className={classes.loadoutItemImage} />
                        <span className={classes.loadoutItemBottomText}>{this.props.itemName}</span>
                    </>
                ) : (
                    <div className={classes.loadoutItemMiddleText}>
                        {this.props.name} <br />
                        <i>{this.props.itemName}</i>
                    </div>
                )}
                {this.props.paintId !== 0 && <PaintedTriangle paintId={this.props.paintId} />}
            </div>
        )
    }
}
export const LoadoutItemDisplay = withStyles(styles)(LoadoutItemDisplayComponent)
