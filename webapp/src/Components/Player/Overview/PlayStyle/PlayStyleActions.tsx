import {Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip} from "@material-ui/core"
import CompareArrows from "@material-ui/icons/CompareArrows"
import * as React from "react"
import {Link} from "react-router-dom"
import {PLAYER_COMPARE_WITH_LINK} from "../../../../Globals"
import {LinkButton} from "../../../Shared/LinkButton"
import {PlayStyleExplanationTable} from "./PlayStyleExplanationTable"

interface OwnProps {
    player: Player
    useFullSizeCompareButton?: boolean
}

type Props = OwnProps

interface State {
    dialogOpen: boolean
}

export class PlayStyleActions extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {dialogOpen: false}
    }

    public render() {
        const compareButton = this.props.useFullSizeCompareButton ?
            <LinkButton icon={CompareArrows} iconType="mui"
                        to={PLAYER_COMPARE_WITH_LINK(this.props.player.id)}>
                Compare
            </LinkButton>
            :
            <div style={{maxHeight: 0}}>
            <Link to={PLAYER_COMPARE_WITH_LINK(this.props.player.id)}>
                <Tooltip title="Compare with...">
                    <IconButton style={{marginRight: 8, top: -3}}>
                        <CompareArrows/>
                    </IconButton>
                </Tooltip>
            </Link>
            </div>

        return (
            <Grid container justify="center" spacing={8}>
                <Grid item xs="auto" style={{display: "flex", justifyContent: "center"}}>
                    {compareButton}
                </Grid>
                <Grid item xs="auto" style={{display: "flex", justifyContent: "center"}}>
                    <Button variant="outlined"
                            onClick={this.handleOpen}
                            style={{marginRight: 8, height: "100%"}}
                    >
                        What are these stats?
                    </Button>
                </Grid>

                <Dialog open={this.state.dialogOpen}
                        onClose={this.handleClose}
                        scroll="paper"
                >
                    <DialogTitle>Explanation of terms</DialogTitle>
                    <DialogContent>
                        <PlayStyleExplanationTable/>
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }

    private readonly handleOpen = () => {
        this.setState({dialogOpen: true})
    }

    private readonly handleClose = () => {
        this.setState({dialogOpen: false})
    }
}
