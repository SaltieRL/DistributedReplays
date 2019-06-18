import * as React from "react"

import { CardMedia, createStyles, Tooltip, WithStyles, withStyles } from "@material-ui/core"

interface OwnProps {
    image: string
    groups: number[]
}

type Props = OwnProps
    & WithStyles<typeof styles>

class PlayerProfilePictureComponent extends React.PureComponent<Props> {
    public render() {
        const {image, classes, groups} = this.props

        const colors = {
            1: "red", // admin
            2: "#FFC107", // alpha
            3: "#8BC34A", // beta
            4: "#03A9F4" // dev
        }
        const letters = {
            1: "A",
            2: "α",
            3: "β",
            4: "D"
        }
        const names = {
            1: "Admin",
            2: "Alpha Tester",
            3: "Beta Tester",
            4: "Developer"
        }
        const hierarchy = [1, 4, 2, 3]
        let userRole = 0
        for (const role of hierarchy) {
            if (groups.indexOf(role) !== -1) {
                userRole = role
                break
            }
        }
        return (
            <>
                <CardMedia className={classes.avatar} image={image}>
                    {userRole !== 0 ? <Tooltip title={names[userRole]}>
                        <div style={{backgroundColor: colors[userRole]}}
                             className={classes.tagNew}>{letters[userRole]}</div>
                    </Tooltip> : null}
                </CardMedia>
            </>
        )
    }
}

const styles = createStyles({
    card: {
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
    },
    tagNew: {
        top: "5%",
        left: "5%",
        position: "relative",
        fontFamily: "Lato",
        fontWeight: 800,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "20px",
        verticalAlign: "middle",
        color: "white"
    }
})

export const PlayerProfilePicture = (withStyles(styles)(PlayerProfilePictureComponent))
