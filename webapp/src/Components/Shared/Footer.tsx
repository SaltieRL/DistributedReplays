import {faGithub} from "@fortawesome/free-brands-svg-icons"
import {createStyles, Grid, Typography, withStyles, WithStyles} from "@material-ui/core"
import * as React from "react"
import {GITHUB_LINK} from "../../Globals"
import {LinkButton} from "./LinkButton"

type Props = WithStyles<typeof styles>

class FooterComponent extends React.PureComponent<Props> {
    public render() {
        return (
            <footer className={this.props.classes.footer}>
                <Grid container justify="space-around">
                    <Typography>
                        &copy; 2017-2018 Saltie Group
                    </Typography>
                    <LinkButton to={GITHUB_LINK} isExternalLink
                                iconType="fontawesome" icon={faGithub}>
                        Github
                    </LinkButton>
                </Grid>
            </footer>
        )
    }
}

const styles = createStyles({
    footer: {
        fontSize: "1em",
        margin: "15px 0",
        borderTop: "1px dashed #ddd"
    }
})

export const Footer = withStyles(styles)(FooterComponent)
