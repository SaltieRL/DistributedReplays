import * as React from "react"

import {CardMedia, createStyles, WithStyles, withStyles} from "@material-ui/core"

interface OwnProps {
    image: string
}

type Props = OwnProps & WithStyles<typeof styles>

class PlayerProfilePictureComponent extends React.PureComponent<Props> {
    public render() {
        const {image, classes} = this.props

        return (
            <>
                <CardMedia className={classes.avatar} image={image} />
            </>
        )
    }
}

const styles = createStyles({
    itemListCard: {
        display: "flex"
    },
    avatar: {
        flex: "0 0 128px"
    },
    content: {
        width: "calc(100% - 128px)"
    },
    nameWrapper: {
        whiteSpace: "nowrap",
        display: "flex"
    }
})

export const PlayerProfilePicture = withStyles(styles)(PlayerProfilePictureComponent)
