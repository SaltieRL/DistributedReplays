import {createStyles, withStyles, WithStyles} from "@material-ui/core"
import React from "react"
import {RARITIES} from "./dataMaps"
import {PaintedTriangle} from "./PaintedTriangle"

const styles = createStyles({
    loadoutItem: {
        height: 128,
        width: 128,
        borderWidth: 3,
        borderRadius: 10,
        borderStyle: "solid",
        backgroundColor: "black",
        display: "inline-block",

        fontSize: 12,
        wordWrap: "break-word",
        flex: "0 0 auto",
        margin: 4,
        textAlign: "center",
        position: "relative",
        color: "white"
    },
    loadoutItemImageWrapper: {
        width: "100%"
    },
    loadoutItemImage: {
        height: 115,
        width: 115,
        marginTop: 4,
        borderRadius: 5
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
        bottom: 25,
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
                        <div className={classes.loadoutItemImageWrapper}>
                            <img
                                alt={this.props.itemName}
                                src={this.props.imageUrl}
                                className={classes.loadoutItemImage}
                            />
                        </div>
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
