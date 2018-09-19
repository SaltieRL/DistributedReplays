import {faDiscord, faGithub, faTwitter, IconDefinition} from "@fortawesome/free-brands-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {createStyles, Divider, Grid, IconButton, Typography, withStyles, WithStyles, withWidth} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import * as React from "react"
import {DISCORD_LINK, GITHUB_LINK, TWITTER_LINK} from "../../Globals"
import {LinkButton} from "./LinkButton"

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
            }
        ]

        const {classes, width} = this.props
        const isWidthUpSM = isWidthUp("sm", width)
        const buttonCreator = isWidthUpSM ? this.createLinkButton : this.createIconButton

        const buttons: JSX.Element[] = buttonDatas.map((buttonData: ButtonData) => (
            <Grid item xs="auto" key={buttonData.text}>
                {buttonCreator(buttonData)}
            </Grid>
        ))
        return (
            <>
                <Divider/>
                <footer className={classes.footer}>
                    <Grid container spacing={24} justify="center" alignItems="center">
                        <Grid item xs={isWidthUpSM ? "auto" : 12}>
                            <Typography align={isWidthUpSM ? "left" : "center"}>
                                &copy; 2017-2018 Saltie Group
                            </Typography>
                        </Grid>
                        <div className={classes.grow}/>
                        {buttons}
                    </Grid>
                </footer>
            </>
        )
    }

    private readonly createLinkButton = (buttonData: ButtonData) => (
        <LinkButton to={buttonData.to} isExternalLink
                    iconType="fontawesome" icon={buttonData.icon}>
            {buttonData.text}
        </LinkButton>
    )

    private readonly createIconButton = (buttonData: ButtonData) => (
        <a href={buttonData.to} target="_blank" style={{textDecoration: "none"}}>
            <IconButton>
                <FontAwesomeIcon icon={buttonData.icon}/>
            </IconButton>
        </a>
    )
}

const styles = createStyles({
    footer: {
        fontSize: "1em",
        borderWidth: "15px 0",
        borderStyle: "solid",
        borderColor: "rgba(0, 0, 0, 0)",
        padding: "0 12px",
        backgroundColor: "rgba(255, 255, 255, 0.4)"
    },
    grow: {
        flexGrow: 1
    }
})

export const Footer = withWidth()(withStyles(styles)(FooterComponent))
