import {
    createStyles,
    Grid,
    IconButton,
    ListItem,
    Theme,
    Typography,
    WithStyles,
    withStyles,
    withWidth
} from "@material-ui/core"
import { WithWidth } from "@material-ui/core/withWidth"
import InsertChart from "@material-ui/icons/InsertChart"
import * as React from "react"
import { connect } from "react-redux"
import { REPLAY_PAGE_LINK } from "../../Globals"
import { StoreState } from "../../Redux"

const styles = (theme: Theme) => createStyles({
    iconButton: {
        "height": "20px",
        "width": "20px",
        "color": theme.palette.secondary.main,
        "&:hover": {
            transitionProperty: "transform",
            transitionDuration: "100ms",
            transform: "scale(1.2)",
            color: theme.palette.secondary.dark
        }
    },
    panelDetails: {
        overflowX: "auto",
        maxWidth: "95vw",
        margin: "auto"
    },
    listGridItem: {
        margin: "auto"
    }
})

interface OwnProps {
    log: AdminLog
}

const mapStateToProps = (state: StoreState) => ({
    loggedInUser: state.loggedInUser
})

type Props = OwnProps
    & WithStyles<typeof styles>
    & WithWidth
    & ReturnType<typeof mapStateToProps>

class AdminLogDisplayRowComponent extends React.PureComponent<Props> {
    public render() {
        const {classes, log} = this.props
        const contents = (
            <Grid container>
                <Grid item xs={1} className={classes.listGridItem}>
                    <Typography>
                        {log.id}
                    </Typography>
                </Grid>
                <Grid item xs={3} className={classes.listGridItem}>
                    <Typography>
                        {log.uuid}
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.listGridItem}>
                    <Typography>
                        {log.result === 1 ? "SUCCESS" : "ERROR"}
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.listGridItem}>
                    <Typography noWrap>
                        {log.errorType}
                    </Typography>
                </Grid>
                <Grid item xs={2} className={classes.listGridItem}>
                    <Typography noWrap>
                        {log.log}
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.listGridItem}>
                    <Typography>
                        {log.params}
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.listGridItem}>
                    <Typography>
                        {log.game &&
                        <IconButton
                            href={REPLAY_PAGE_LINK(log.game)}
                            className={classes.iconButton}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <InsertChart/>
                        </IconButton>}
                    </Typography>
                </Grid>
            </Grid>
        )

        return (
            <ListItem>
                {contents}
            </ListItem>
        )
    }
}

export const AdminLogDisplayRow = withWidth()(withStyles(styles)(
    connect(mapStateToProps)(AdminLogDisplayRowComponent)))
