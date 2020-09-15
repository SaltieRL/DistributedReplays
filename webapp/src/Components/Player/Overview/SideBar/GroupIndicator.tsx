import {faPatreon} from "@fortawesome/free-brands-svg-icons/faPatreon"
import {faAtom} from "@fortawesome/free-solid-svg-icons/faAtom"
import {faCode} from "@fortawesome/free-solid-svg-icons/faCode"
import {faGavel} from "@fortawesome/free-solid-svg-icons/faGavel"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {createStyles, Tooltip, Typography, WithStyles, withStyles} from "@material-ui/core"
import {ThemeStyle} from "@material-ui/core/styles/createTypography"
import * as React from "react"

interface OwnProps {
    groups: number[]
    faded?: boolean
    variant?: ThemeStyle | "srOnly" | "inherit"
}

const styles = createStyles({
    tagNew: {
        fontFamily: "Lato",
        fontWeight: 800,
        padding: "10px",
        width: "30px",
        height: "30px",
        borderRadius: "100%",
        textAlign: "center",
        lineHeight: "30px",
        verticalAlign: "middle",
        color: "white",
        fontSize: "30px"
    }
})
type Props = OwnProps & WithStyles<typeof styles>

class GroupIndicatorComponent extends React.PureComponent<Props> {
    public render() {
        const {groups} = this.props
        const colors = {
            1: "red", // admin
            2: "#ffbc07", // alpha
            3: "#e67e22", // beta
            4: "#03A9F4" // dev
        }
        const letters = {
            1: faGavel,
            2: faAtom,
            3: faPatreon,
            4: faCode
        }
        const names = {
            1: "Admin",
            2: "Alpha Tester",
            3: "Patron",
            4: "Developer"
        }
        const hierarchy = [1, 4, 2, 3]
        let userRole = 0
        for (const role of hierarchy) {
            if (groups === undefined) {
                break
            }
            if (groups.includes(role)) {
                userRole = role
                break
            }
        }
        return (
            <>
                {userRole !== 0 && (
                    <Tooltip title={names[userRole]}>
                        <Typography
                            variant={this.props.variant ? this.props.variant : "inherit"}
                            style={{color: this.props.faded ? "#ccc" : colors[userRole]}}
                        >
                            <FontAwesomeIcon icon={letters[userRole]} />
                        </Typography>
                    </Tooltip>
                )}
            </>
        )
    }
}

export const GroupIndicator = withStyles(styles)(GroupIndicatorComponent)
