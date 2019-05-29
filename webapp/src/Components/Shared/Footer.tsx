import { faDiscord, faGithub, faPatreon, faReddit, faTwitter, IconDefinition } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    ButtonBase,
    createStyles,
    Divider,
    Grid,
    IconButton,
    Theme,
    Typography,
    withStyles,
    WithStyles,
    withWidth
} from "@material-ui/core"
import { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import * as React from "react"
import { Link } from "react-router-dom"
import {
    ABOUT_LINK,
    DISCORD_LINK, EXPLANATIONS_LINK,
    GITHUB_LINK,
    GLOBAL_STATS_LINK, PATREON_LINK,
    REDDIT_LINK,
    STATUS_PAGE_LINK,
    TWITTER_LINK
} from "../../Globals"

const styles = (theme: Theme) => createStyles({
    footer: {
        fontSize: "1em",
        borderWidth: "8px 0",
        borderStyle: "solid",
        borderColor: "rgba(0, 0, 0, 0)",
        padding: "0 12px",
        backgroundColor: (theme.palette.type === "dark" ?
            theme.palette.primary.dark : theme.palette.primary.light) + "cc"
    },
    grow: {
        flexGrow: 1
    }
})

interface ButtonData {
    to: string
    icon: IconDefinition
    text: string
}

type Props = WithStyles<typeof styles>
    & WithWidth

class FooterComponent extends React.PureComponent<Props> {
    public render() {
        const buttonDatas: ButtonData[] = [
            {
                to: TWITTER_LINK,
                icon: faTwitter,
                text: "Twitter"
            },
            {
                to: DISCORD_LINK,
                icon: faDiscord,
                text: "Discord"
            },
            {
                to: GITHUB_LINK,
                icon: faGithub,
                text: "Github"
            },
            {
                to: REDDIT_LINK,
                icon: faReddit,
                text: "Reddit"
            },
            {
                to: PATREON_LINK,
                icon: faPatreon,
                text: "Patreon"
            }
        ]

        const {classes, width} = this.props
        const isWidthUpLg = isWidthUp("lg", width)

        const buttons: JSX.Element[] = buttonDatas.map((buttonData: ButtonData) => (
            <Grid item xs="auto" key={buttonData.text}>
                {this.createIconButton(buttonData)}
            </Grid>
        ))
        return (
            <>
                <Divider/>
                <footer className={classes.footer}>
                    <Grid container spacing={24} justify="center" alignItems="center">
                        <Grid item xs={12} lg={3}>
                            <Typography align={isWidthUpLg ? "left" : "center"}>
                                &copy; 2017-2019 Saltie Group
                            </Typography>
                        </Grid>
                        <Grid item xs={12} lg={5}
                              container justify={isWidthUpLg ? "flex-start" : "center"} spacing={16}
                        >
                            <Grid item>
                                <Link to={"/"} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpLg ? "left" : "center"}>
                                            Home
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item> | </Grid>
                            <Grid item>
                                <Link to={GLOBAL_STATS_LINK} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpLg ? "left" : "center"}>
                                            Global Stats
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item> | </Grid>
                            <Grid item>
                                <Link to={ABOUT_LINK} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpLg ? "left" : "center"}>
                                            About Us
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item> | </Grid>
                            <Grid item>
                                <Link to={STATUS_PAGE_LINK} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpLg ? "left" : "center"}>
                                            Status
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item> | </Grid>
                            <Grid item>
                                <Link to={EXPLANATIONS_LINK} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpLg ? "left" : "center"}>
                                            Stat Explanations
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                        </Grid>
                        <div className={classes.grow}/>
                        {buttons}
                    </Grid>
                </footer>
            </>
        )
    }

    private readonly createIconButton = (buttonData: ButtonData) => (
        <a href={buttonData.to} target="_blank" rel="noreferrer noopener" style={{textDecoration: "none"}}>
            <IconButton>
                <FontAwesomeIcon icon={buttonData.icon}/>
            </IconButton>
        </a>
    )
}

export const Footer = withWidth()(withStyles(styles)(FooterComponent))
