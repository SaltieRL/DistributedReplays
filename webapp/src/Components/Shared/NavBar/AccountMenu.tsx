import { faSteam } from "@fortawesome/free-brands-svg-icons"
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardMedia,
    createStyles,
    Grid,
    IconButton,
    Popover,
    WithStyles,
    withStyles
} from "@material-ui/core"
import * as React from "react"
import { Link } from "react-router-dom"
import { LOCAL_LINK, LOGOUT_LINK, PLAYER_PAGE_LINK, STEAM_LOGIN_LINK } from "../../../Globals"
import { LoggedInUserState } from "../../../Redux/loggedInUser/reducer"
import { LinkButton } from "../LinkButton"

interface OwnProps {
    loggedInUser: LoggedInUserState
}

type Props = OwnProps
    & WithStyles<typeof styles>

interface State {
    open: boolean
    anchorElement?: HTMLElement
}

export class AccountMenuComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {open: false}
    }

    public render() {
        const {classes, loggedInUser} = this.props

        return (
            <>
                {loggedInUser ?
                    <>
                        <IconButton onClick={this.handleOpen} className={classes.iconButtonWrapper}>
                            <Avatar src={loggedInUser.avatarLink}/>
                        </IconButton>
                        <Popover open={this.state.open}
                                 onClose={this.handleClose}
                                 anchorEl={this.state.anchorElement}
                                 anchorOrigin={{
                                     vertical: "bottom",
                                     horizontal: "center"
                                 }}
                                 transformOrigin={{
                                     vertical: "top",
                                     horizontal: "center"
                                 }}
                        >
                            <Card>
                                <CardMedia className={classes.avatar} image={loggedInUser.avatarLink}/>
                                <CardActions>
                                    <Grid container
                                          direction="column"
                                          justify="space-between"
                                          spacing={8}
                                          className={classes.actions}
                                    >
                                        <Grid item>
                                            <Link to={PLAYER_PAGE_LINK(loggedInUser.id)}
                                                  style={{textDecoration: "none"}}>
                                                <Button variant="outlined">
                                                    My Profile
                                                </Button>
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="outlined" href={LOCAL_LINK + LOGOUT_LINK}>
                                                Log out
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardActions>
                            </Card>
                        </Popover>
                    </>
                    :
                    <LinkButton to={LOCAL_LINK + STEAM_LOGIN_LINK} isExternalLink
                                iconType="fontawesome" icon={faSteam}>
                        Log in
                    </LinkButton>
                }
            </>
        )
    }

    private readonly handleOpen: React.MouseEventHandler<HTMLElement> = (event) => {
        this.setState({anchorElement: event.currentTarget, open: true})
    }

    private readonly handleClose = () => {
        this.setState({
            open: false,
            anchorElement: undefined
        })
    }
}

const styles = createStyles({
    iconButtonWrapper: {
        padding: 0,
        height: 48,
        width: 48
    },
    avatar: {
        height: 128,
        width: 128
    },
    actions: {
        textAlign: "center"
    }
})

export const AccountMenu = withStyles(styles)(AccountMenuComponent)
