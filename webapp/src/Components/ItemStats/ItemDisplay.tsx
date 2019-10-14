import { Card, CardContent, CardMedia, createStyles, Typography, WithStyles, withStyles } from "@material-ui/core"
import * as React from "react"
import { ItemFull } from "../../Models/ItemStats"

interface OwnProps {
    item: ItemFull
    paint?: number
}

type Props = OwnProps
    & WithStyles<typeof styles>
const styles = createStyles({
    content: {
        width: "calc(100% - 128px)"
    },
    itemCard: {
        display: "flex",
        minHeight: 128
    }
})

// const PAINT_COLOR_MAP = {
//     6: "#4c1101",
//     2: "#7efd01",
//     12: "#FFFFFF",
//     4: "#3f51b4",
//     1: "#d40001",
//     7: "#4cae50",
//     11: "#777777",
//     10: "#f3b301",
//     9: "#fd4080",
//     8: "#9C27B0",
//     13: "#fdea3b",
//     5: "#03a8f3",
//     3: "#111111"
// }
// const PAINT_MAP = {
//     0: "None",
//     1: "Crimson",
//     2: "Lime",
//     3: "Black",
//     4: "Cobalt",
//     5: "Sky Blue",
//     6: "Burnt Sienna",
//     7: "Forest Green",
//     8: "Purple",
//     9: "Pink",
//     10: "Orange",
//     11: "Grey",
//     12: "Titanium White",
//     13: "Saffron"
// }
const rarities = [{
    start: "#000000",
    end: "#000000",
    quantitybg: "#000000",
    rlgstart: "rgba(0,0,0,0)",
    rlgend: "rgba(0,0,0,0)"
}, {
    start: "#030102",
    end: "#325765",
    quantitybg: "#337387",
    rlgstart: "rgba(125,217,253,0)",
    rlgend: "rgba(125,217,253,1)"
}, {
    start: "#030102",
    end: "#2b6146",
    quantitybg: "#00855c",
    rlgstart: "rgba(107,241,174,0)",
    rlgend: "rgba(107,241,174,1)"
}, {
    start: "#030102",
    end: "#623016",
    quantitybg: "#883d00",
    rlgstart: "rgba(247,121,57,0)",
    rlgend: "rgba(247,121,57,1)"
}, {
    start: "#030102",
    end: "#2f3d5e",
    quantitybg: "#3c4c80",
    rlgstart: "rgba(116,151,235,0)",
    rlgend: "rgba(116,151,235,1)"
}, {
    start: "#030102",
    end: "#3f3164",
    quantitybg: "#552b84",
    rlgstart: "rgba(149,107,242,0)",
    rlgend: "rgba(149,107,242,1)"
}, {
    start: "#030102",
    end: "#3f3164",
    quantitybg: "#5b3889",
    rlgstart: "rgba(158,124,252,0)",
    rlgend: "rgba(158,124,252,1)"
}, {
    start: "#030102",
    end: "#5a2420",
    quantitybg: "#832925",
    rlgstart: "rgba(227,90,82,0)",
    rlgend: "rgba(227,90,82,1)"
}, {
    start: "#030102",
    end: "#5e582b",
    quantitybg: "#7e772d",
    rlgstart: "rgba(236,219,108,0)",
    rlgend: "rgba(236,219,108,1)"
}, {
    start: "#030102",
    end: "#660066",
    quantitybg: "#880088",
    rlgstart: "rgba(255,0,255,0)",
    rlgend: "rgba(255,0,255,1)"
}]

const CATEGORIES = [
    "Body",
    "Wheel",
    "Rocket Boost",
    "Topper", "Antenna",
    "Decal", "Crate",
    "Paint Finish",
    "Trail",
    "Goal Explosion",
    "Banner",
    "Engine Audio",
    "Avatar Border",
    "Title"
]
const RARITY_NAMES = [
    "Common",
    "Uncommon",
    "Premium",
    "Limited",
    "Rare",
    "Very Rare",
    "Super Rare",
    "Import",
    "Exotic",
    "Black Market"
]

export class ItemDisplayComponent extends React.PureComponent<Props> {
    public render() {
        const {item, classes} = this.props
        return (
            <Card className={classes.itemCard}>
                <CardMedia style={{flex: "0 0 128px"}}
                           image={item.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h4">
                        {item.name}
                    </Typography>
                    <Typography style={{color: rarities[item.rarity].rlgend}} variant="subtitle1">
                        {RARITY_NAMES[item.rarity - 1]}  {CATEGORIES[item.category - 1]}
                    </Typography>
                </CardContent>
            </Card>
        )
        // (
        {/*    <div style={{*/
        }
        {/*        position: "relative",*/
        }
        {/*        border: `${rarities[item.rarity].rlgend} 2px solid`*/
        }
        {/*    }}>*/
        }
        {/*        <img alt={item.name} src={item.image} height={"134px"}/>*/
        }
        {/*        {paint ? (*/
        }
        {/*            <Tooltip title={PAINT_MAP[paint]}>*/
        }
        {/*                <div style={{*/
        }
        {/*                    backgroundColor: PAINT_COLOR_MAP[paint],*/
        }
        {/*                    border: "2px solid rgba(255,255,255,.3)",*/
        }
        {/*                    transform: "rotate(45deg)",*/
        }
        {/*                    width: "35px",*/
        }
        {/*                    height: "20px",*/
        }
        {/*                    position: "absolute",*/
        }
        {/*                    left: "85%",*/
        }
        {/*                    top: "-6px",*/
        }
        {/*                    zIndex: 999*/
        }
        {/*                }}/>*/
        }
        {/*            </Tooltip>*/
        }
        {/*        ) : null}*/
        }
        {/*    </div>*/
        }
        {/*)*/
        }

        // )
    }
}

export const ItemDisplay = withStyles(styles)(ItemDisplayComponent)
