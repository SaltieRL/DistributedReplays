import {faDiscord, faGithub, faPatreon, faRedditAlien, faTwitter} from "@fortawesome/free-brands-svg-icons"
import {faChartBar} from "@fortawesome/free-solid-svg-icons"
import {Grid, withWidth} from "@material-ui/core"
import {isWidthUp, WithWidth} from "@material-ui/core/withWidth"
import Info from "@material-ui/icons/Info"
import * as React from "react"
import {
    ABOUT_LINK,
    DISCORD_LINK,
    GITHUB_LINK,
    GLOBAL_STATS_LINK,
    PATREON_LINK,
    REDDIT_LINK,
    TWITTER_LINK
} from "../../Globals"
import {LinkButton} from "../Shared/LinkButton"

const HomePageFooterComponent: React.FunctionComponent<WithWidth> = (props: WithWidth) => {
    const globalStatsLinkButton = (
        <LinkButton to={GLOBAL_STATS_LINK} iconType="fontawesome" icon={faChartBar} tooltip="Global stats" />
    )
    const aboutLinkButton = <LinkButton to={ABOUT_LINK} iconType="mui" icon={Info} tooltip="About" />
    const twitterLinkButton = (
        <LinkButton to={TWITTER_LINK} isExternalLink iconType="fontawesome" icon={faTwitter} tooltip="Twitter" />
    )
    const discordLinkButton = (
        <LinkButton to={DISCORD_LINK} isExternalLink iconType="fontawesome" icon={faDiscord} tooltip="Discord" />
    )
    const githubLinkButton = (
        <LinkButton to={GITHUB_LINK} isExternalLink iconType="fontawesome" icon={faGithub} tooltip="Github" />
    )
    const redditLinkButton = (
        <LinkButton to={REDDIT_LINK} isExternalLink iconType="fontawesome" icon={faRedditAlien} tooltip="Reddit" />
    )
    const patreonLinkButton = (
        <LinkButton to={PATREON_LINK} isExternalLink iconType="fontawesome" icon={faPatreon} tooltip="Patreon" />
    )

    return (
        <Grid container justify="center" spacing={2}>
            {isWidthUp("md", props.width) ? (
                [
                    [globalStatsLinkButton, aboutLinkButton, twitterLinkButton, discordLinkButton],
                    [githubLinkButton, redditLinkButton, patreonLinkButton]
                ].map((linkButtonRow, i) => (
                    <Grid item xs={12} justify="center" container key={i}>
                        {linkButtonRow.map((linkButton, j) => (
                            <Grid item xs={3} md={2} style={{textAlign: "center"}} key={j}>
                                {linkButton}
                            </Grid>
                        ))}
                    </Grid>
                ))
            ) : (
                <>
                    {[
                        [globalStatsLinkButton, aboutLinkButton],
                        [twitterLinkButton, discordLinkButton, githubLinkButton, redditLinkButton, patreonLinkButton]
                    ].map((linkButtonRow, i) => (
                        <Grid item xs={12} container justify="space-around" key={i}>
                            {linkButtonRow.map((linkButton, j) => (
                                <Grid item xs="auto" style={{textAlign: "center"}} key={j}>
                                    {linkButton}
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </>
            )}
        </Grid>
    )
}

export const HomePageFooter = withWidth()(HomePageFooterComponent)
