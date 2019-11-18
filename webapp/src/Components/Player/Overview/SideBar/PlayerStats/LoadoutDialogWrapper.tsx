import { Dialog, DialogTitle, Grid, IconButton, Typography } from "@material-ui/core"
import CardTravel from "@material-ui/icons/CardTravel"
import OpenInBrowser from "@material-ui/icons/OpenInBrowser"

import * as React from "react"
import { LoadoutDisplay } from "../../../../Replay/ReplayTeamCard/LoadoutDisplay"

interface Props {
    playerStats: PlayerStats
    handleShowLoadout: () => void
    handleCloseLoadout: () => void
    loadoutOpen: boolean
}

export class LoadoutDialogWrapper extends React.PureComponent<Props> {
    public render() {
        return (
            <Grid container alignItems="center" justify="space-around" spacing={1}>
                <Grid item xs={3}>
                    <Typography> <CardTravel/> </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1">
                        loadout
                    </Typography>
                </Grid>
                <Grid item xs={3} container direction="column" alignItems="center">
                    <IconButton onClick={this.props.handleShowLoadout}>
                        <OpenInBrowser/>
                    </IconButton>
                </Grid>
                <Dialog open={this.props.loadoutOpen} onClose={this.props.handleCloseLoadout}>
                    <DialogTitle>Loadout</DialogTitle>
                    <LoadoutDisplay loadout={this.props.playerStats.loadout}/>
                </Dialog>
            </Grid>
        )
    }
}
