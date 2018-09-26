import {Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip} from "@material-ui/core"
import CompareArrows from "@material-ui/icons/CompareArrows"
import * as React from "react"
import {Link} from "react-router-dom"
import {PLAYER_COMPARE_WITH_LINK} from "../../../../Globals"
import {LinkButton} from "../../../Shared/LinkButton"
import {PlayStyleExplanationTable} from "./PlayStyleExplanationTable"

interface Props {
    player: Player
    useFullSizeCompareButton?: boolean
}

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
                Compare With
            </LinkButton>
            :
            <Link to={PLAYER_COMPARE_WITH_LINK(this.props.player.id)}>
                <Tooltip title="Compare with...">
                    <IconButton style={{marginRight: 8}}>
                        <CompareArrows/>
                    </IconButton>
                </Tooltip>
            </Link>

        return (
            <div style={{display: "flex"}}>
                <div style={{marginRight: 8}}>
                    {compareButton}
                </div>
                <Button variant="outlined"
                        onClick={this.handleOpen}
                        style={{marginRight: 8}}
                >
                    What are these stats?
                </Button>
                <Dialog open={this.state.dialogOpen}
                        onClose={this.handleClose}
                        scroll="paper"
                >
                    <DialogTitle>Explanation of terms</DialogTitle>
                    <DialogContent>
                        <PlayStyleExplanationTable/>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    private readonly handleOpen = () => {
        this.setState({dialogOpen: true})
    }

    private readonly handleClose = () => {
        this.setState({dialogOpen: false})
    }
}
