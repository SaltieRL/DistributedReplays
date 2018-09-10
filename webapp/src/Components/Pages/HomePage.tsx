import * as React from "react"
import {Logo} from "../Shared/Logo/Logo"
import {Search} from "../Shared/Search"

import {faGlobeAmericas} from "@fortawesome/free-solid-svg-icons"
import {createStyles, Grid, Typography, WithStyles, withStyles} from "@material-ui/core"
import Divider from "@material-ui/core/Divider/Divider"
import {GridProps} from "@material-ui/core/Grid"
import {LinkButton} from "../Shared/LinkButton"
import {UploadModalWrapper} from "../Shared/Upload/UploadModalWrapper"

type Props = WithStyles<typeof styles>

interface State {
    replayCount?: number
}

class HomePageComponent extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount() {
        this.getReplayCount()
            .then((replayCount: number) => this.setState({replayCount}))
    }

    public render() {
        const {classes} = this.props

        const alignCenterProps: GridProps = {container: true, justify: "center", alignItems: "center"}
        return (
            <UploadModalWrapper buttonStyle="floating">
                <div className={classes.root}>
                    <Grid container justify="center" alignItems="flex-start" spacing={40} className={classes.child}>
                        <Grid item xs={12} {...alignCenterProps} style={{minHeight: "300px"}} direction="column">
                            <Logo imgStyle={{maxWidth: "80vw"}}/>
                            {this.state.replayCount &&
                            <>
                                <br/>
                                <Typography>
                                    <i>1337 replays and counting...</i>
                                </Typography>
                            </>
                            }
                        </Grid>
                        <Grid item xs={11} {...alignCenterProps} style={{padding: "20px 0 20px 0"}}>
                            <Search usePaper/>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={6} xl={4}>
                            <HomePageFooter/>
                        </Grid>
                    </Grid>
                </div>
            </UploadModalWrapper>
        )
    }

    private readonly getReplayCount = (): Promise<number> => {
        // TODO: Make call to get number of replays
        return Promise.resolve(1337)
    }
}

const HomePageFooter: React.SFC = () => {
    const linkButtonGridItemProps: GridProps = {item: true, xs: 12, sm: 4, md: 2, style: {textAlign: "center"}}
    return (
        <Grid container justify="center" spacing={16}>
            <Grid item xs={12} sm={12} md={4} style={{textAlign: "center"}}>
                <LinkButton to="/replay/stats" leftIcon={faGlobeAmericas}> global stats </LinkButton>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to=""> about </LinkButton>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to="/redirect_to/github"> github </LinkButton>
            </Grid>
            <Grid {...linkButtonGridItemProps}>
                <LinkButton to=""> discord </LinkButton>
            </Grid>
        </Grid>
    )
}


const styles = createStyles({
    root: {
        margin: "auto",
        width: "100%",
        overflowX: "hidden"
    },
    child: {
        margin: "auto",
        padding: "20px",
        height: "100%",
        width: "100%"
    }
})

export const HomePage = (withStyles(styles)(HomePageComponent))
