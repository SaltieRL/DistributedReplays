import { faDiscord, faGithub, faReddit, faTwitter, IconDefinition } from "@fortawesome/free-brands-svg-icons"
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
    GLOBAL_STATS_LINK,
    REDDIT_LINK,
    STATUS_PAGE_LINK,
    TWITTER_LINK
} from "../../Globals"

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
            }
        ]

        const {classes, width} = this.props
        const isWidthUpMd = isWidthUp("md", width)

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
                        <Grid item xs={12} md={3}>
                            <Typography align={isWidthUpMd ? "left" : "center"}>
                                &copy; 2017-2018 Saltie Group
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={5}
                              container justify={isWidthUpMd ? "flex-start" : "center"} spacing={16}
                        >
                            <Grid item>
                                <Link to={"/"} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpMd ? "left" : "center"}>
                                            Home
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item> | </Grid>
                            <Grid item>
                                <Link to={GLOBAL_STATS_LINK} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpMd ? "left" : "center"}>
                                            Global Stats
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item> | </Grid>
                            <Grid item>
                                <Link to={ABOUT_LINK} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpMd ? "left" : "center"}>
                                            About Us
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item> | </Grid>
                            <Grid item>
                                <Link to={STATUS_PAGE_LINK} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpMd ? "left" : "center"}>
                                            Status
                                        </Typography>
                                    </ButtonBase>
                                </Link>
                            </Grid>
                            <Grid item> | </Grid>
                            <Grid item>
                                <Link to={EXPLANATIONS_LINK} style={{textDecoration: "none"}}>
                                    <ButtonBase>
                                        <Typography align={isWidthUpMd ? "left" : "center"}>
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
        <a href={buttonData.to} target="_blank" style={{textDecoration: "none"}}>
            <IconButton>
                <FontAwesomeIcon icon={buttonData.icon}/>
            </IconButton>
        </a>
    )
}

const styles = (theme: Theme) => createStyles({
    footer: {
        fontSize: "1em",
        borderWidth: "8px 0",
        borderStyle: "solid",
        borderColor: "rgba(0, 0, 0, 0)",
        padding: "0 12px",
        backgroundColor: theme.palette.primary.light + "cc"
    },
    grow: {
        flexGrow: 1
    }
})

export const Footer = withWidth()(withStyles(styles)(FooterComponent))
